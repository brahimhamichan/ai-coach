import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

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

            // Extract payload fields per PRD contract
            const {
                user_id,
                call_type,
                call_session_id,
                timestamp,
                summary_text,
                extracted,
            } = body;

            // Validate required fields
            if (!user_id || !call_type || !call_session_id) {
                return new Response(
                    JSON.stringify({ error: "Missing required fields" }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }

            // Get the user - for MVP, we use the stub user
            const user = await ctx.runQuery(internal.users.getStubUserInternal);
            if (!user) {
                return new Response(
                    JSON.stringify({ error: "User not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            // Update call session status to completed
            if (call_session_id) {
                try {
                    await ctx.runMutation(internal.callSessions.updateCallSessionStatus, {
                        sessionId: call_session_id,
                        status: "completed",
                        lastAttemptAt: timestamp || new Date().toISOString(),
                    });
                } catch (e) {
                    console.log("Could not update session - may be test data:", e);
                }
            }

            // Create call summary
            if (summary_text) {
                await ctx.runMutation(internal.callSummaries.createCallSummary, {
                    userId: user._id,
                    callSessionId: call_session_id,
                    callType: call_type,
                    timestamp: timestamp || new Date().toISOString(),
                    summaryText: summary_text,
                    extractedData: extracted,
                });
            }

            // Process extracted data based on call type
            if (extracted) {
                switch (call_type) {
                    case "onboarding":
                        if (extracted.vision) {
                            await ctx.runMutation(internal.visionProfiles.createVisionProfile, {
                                userId: user._id,
                                visionSummary: extracted.vision.summary || "",
                                motivations: extracted.vision.motivations || [],
                                costOfInaction: extracted.vision.cost_of_inaction || "",
                                commitmentDeclaration: extracted.vision.commitment || "",
                                rawOnboardingNotes: summary_text,
                            });
                        }
                        break;

                    case "weekly":
                        if (extracted.weekly) {
                            await ctx.runMutation(internal.weeklyObjectives.createWeeklyObjective, {
                                userId: user._id,
                                weekStartDate: getWeekStartDate(),
                                objective: extracted.weekly.objective || "",
                                bottlenecks: extracted.weekly.bottlenecks || [],
                                actions: extracted.weekly.actions || [],
                                stopList: extracted.weekly.stop || [],
                                startList: extracted.weekly.start || [],
                                continueList: extracted.weekly.continue || [],
                            });
                        }
                        break;

                    case "evening":
                        if (extracted.daily) {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            const tomorrowDate = tomorrow.toISOString().split("T")[0];

                            await ctx.runMutation(internal.dailyPlans.createDailyPlan, {
                                userId: user._id,
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

            return new Response(
                JSON.stringify({ success: true }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
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
