import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Vapi webhook endpoint
// Receives call completion events and processes them
http.route({
    path: "/vapi/webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        try {
            const body = await request.json();

            // Log incoming webhook for debugging
            console.log("Vapi webhook received:", JSON.stringify(body, null, 2));

            const message = body.message;

            // Handle "end-of-call-report" from VAPI
            if (message && message.type === "end-of-call-report") {
                const call = message.call;
                const analysis = message.analysis;

                const vapiCallId = message.call.id;
                const recordingUrl = message.recordingUrl || message.artifact?.recordingUrl;
                const transcript = message.transcript || message.artifact?.transcript;
                const summary = analysis?.summary || message.analysis?.summary || message.summary;

                const startedAt = message.startedAt || message.call.startedAt || new Date().toISOString();
                const endedAt = message.endedAt || message.call.endedAt || new Date().toISOString();

                // Duration in seconds
                const durationSeconds = (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000;

                let userId = null;
                let callSessionId = null;

                // 1. Try to find user via existing session (if we triggered it)
                const session = await ctx.runQuery(internal.callSessions.getCallSessionByVapiCallId, { vapiCallId });
                if (session) {
                    userId = session.userId;
                    callSessionId = session._id;
                } else {
                    // 2. Fallback: Find by phone number
                    const customerNumber = message.customer?.number;
                    if (customerNumber) {
                        const user = await ctx.runQuery(internal.users.getUserByPhone, { phone: customerNumber });
                        if (user) {
                            userId = user._id;
                        }
                    }
                }

                if (!userId) {
                    console.warn(`Could not associate Vapi call ${vapiCallId} with a user.`);
                    // We can still log it to `calls` if we want, but without userId it's orphaned.
                    // The schema requires userId. 
                    return new Response(JSON.stringify({ success: true }), { status: 200 });
                }

                // If no session found but we found user, maybe it was inbound?
                // We could create a session or just log the call.

                await ctx.runMutation(internal.calls.createCall, {
                    vapiCallId: vapiCallId,
                    userId: userId,
                    callSessionId: callSessionId ? (callSessionId as any) : undefined,
                    status: message.status || (message.endedReason === "customer-did-not-answer" ? "missed" : "completed"),
                    direction: message.call.type === "inboundPhoneCall" ? "inbound" : "outbound",
                    startedAt: startedAt,
                    endedAt: endedAt,
                    durationSeconds: durationSeconds,
                    recordingUrl: recordingUrl,
                    transcription: transcript,
                    summary: summary,
                });

                // Update session status if we have one
                if (callSessionId) {
                    await ctx.runMutation(internal.callSessions.updateCallSessionStatus, {
                        sessionId: callSessionId as any,
                        status: "completed",
                        lastAttemptAt: endedAt,
                    });
                }

                // Handle extracted data (Structured Data from Vapi Analysis)
                const extracted = message.analysis?.structuredData;

                // Determine call type from session or guess from data
                // We can use the session's callType if we found it
                let callType = session?.callType;

                // If we didn't find session (e.g. inbound), try to infer from extracted keys
                if (!callType && extracted) {
                    if (extracted.vision) callType = "onboarding-agent";
                    else if (extracted.weekly) callType = "weekly-agent";
                    else if (extracted.daily) callType = "daily-agent";
                }

                if (userId && callType) {
                    // Create Call Summary
                    // Normalize call type for summary table
                    let summaryCallType: "onboarding-agent" | "weekly-agent" | "daily-agent" | null = null;
                    if (callType === "onboarding-agent") summaryCallType = "onboarding-agent";
                    else if (callType === "weekly-agent") summaryCallType = "weekly-agent";
                    // Map legacy/other types to standard agent types
                    else if (callType === "daily-agent" || callType === "evening" || callType === "daily") summaryCallType = "daily-agent";

                    if (summaryCallType && callSessionId) {
                        try {
                            await ctx.runMutation(internal.callSummaries.createCallSummary, {
                                userId: userId,
                                callSessionId: callSessionId as any,
                                callType: summaryCallType,
                                timestamp: endedAt,
                                summaryText: summary || "No summary available",
                                extractedData: extracted,
                            });
                        } catch (err) {
                            console.error("Failed to create call summary:", err);
                        }
                    }

                    // Process specific extracted data into domain tables
                    if (extracted) {
                        switch (summaryCallType) {
                            case "onboarding-agent":
                                if (extracted.vision) {
                                    await ctx.runMutation(internal.visionProfiles.createVisionProfile, {
                                        userId: userId,
                                        visionSummary: extracted.vision.summary || "",
                                        motivations: extracted.vision.motivations || [],
                                        costOfInaction: extracted.vision.cost_of_inaction || "",
                                        commitmentDeclaration: extracted.vision.commitment || "",
                                        rawOnboardingNotes: summary,
                                    });
                                }
                                break;

                            case "weekly-agent":
                                if (extracted.weekly) {
                                    // Helper for week start
                                    const now = new Date();
                                    const dayOfWeek = now.getDay();
                                    const weekStart = new Date(now);
                                    weekStart.setDate(now.getDate() - dayOfWeek);
                                    weekStart.setHours(0, 0, 0, 0);
                                    const weekStartDate = weekStart.toISOString().split("T")[0];

                                    await ctx.runMutation(internal.weeklyObjectives.createWeeklyObjective, {
                                        userId: userId,
                                        weekStartDate: weekStartDate,
                                        objective: extracted.weekly.objective || "",
                                        bottlenecks: extracted.weekly.bottlenecks || [],
                                        actions: extracted.weekly.actions || [],
                                        stopList: extracted.weekly.stop || [],
                                        startList: extracted.weekly.start || [],
                                        continueList: extracted.weekly.continue || [],
                                    });
                                }
                                break;

                            case "daily-agent":
                                if (extracted.daily) {
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    const tomorrowDate = tomorrow.toISOString().split("T")[0];

                                    await ctx.runMutation(internal.dailyPlans.createDailyPlan, {
                                        userId: userId,
                                        date: tomorrowDate,
                                        actions: (extracted.daily.actions || []).map((text: string) => ({
                                            text,
                                            completed: false,
                                        })),
                                    });
                                }
                                break;
                        }
                    }
                }

                return new Response(JSON.stringify({ success: true }), { status: 200 });
            }

            // Fallback for custom/legacy payloads if needed, or just ack.
            // Assuming we migrated to standard Vapi logic.
            return new Response(JSON.stringify({ success: true }), { status: 200 });

        } catch (error) {
            console.error("Vapi webhook error:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    }),
});

// Helper function to get current week start date (Sunday)
function getWeekStartDate(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString().split("T")[0];
}

// Vapi tool call action endpoint
http.route({
    path: "/vapi/action",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        try {
            const body = await request.json();
            console.log("Vapi tool call received:", JSON.stringify(body, null, 2));

            const message = body.message;

            if (message && message.type === "tool-calls") {
                const toolCalls = message.toolCalls;
                const vapiCallId = message.call.id;
                const results: any[] = [];

                for (const toolCall of toolCalls) {
                    const functionName = toolCall.function.name;
                    const functionArgs = JSON.parse(toolCall.function.arguments);
                    let agentType: "onboarding" | "weekly" | "daily" | null = null;

                    // Map function name to agent type
                    if (functionName === "saveOnboardingData") agentType = "onboarding";
                    else if (functionName === "saveWeeklyData") agentType = "weekly";
                    else if (functionName === "saveDailyData") agentType = "daily";

                    if (agentType) {
                        try {
                            const result = await ctx.runMutation(internal.agent.saveAgentData, {
                                vapiCallId,
                                agentType,
                                data: functionArgs,
                            });

                            results.push({
                                toolCallId: toolCall.id,
                                result: JSON.stringify({ success: true, message: "Data saved successfully" }),
                            });
                        } catch (err: any) {
                            console.error(`Error saving agent data for ${functionName}:`, err);
                            results.push({
                                toolCallId: toolCall.id,
                                result: JSON.stringify({ success: false, error: err.message }),
                            });
                        }
                    } else {
                        results.push({
                            toolCallId: toolCall.id,
                            result: JSON.stringify({ success: false, error: "Unknown tool" }),
                        });
                    }
                }

                return new Response(JSON.stringify({ results }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }

            return new Response(JSON.stringify({ success: true }), { status: 200 });

        } catch (error) {
            console.error("Vapi tool call error:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    }),
});


// Health check endpoint
http.route({
    path: "/health",
    method: "GET",
    handler: httpAction(async () => {
        return new Response(
            JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }),
});

export default http;
