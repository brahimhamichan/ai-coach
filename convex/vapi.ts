import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { saveOnboardingDataTool } from "./vapi/tools/onboarding";
import { saveWeeklyDataTool } from "./vapi/tools/weekly";
import { saveDailyDataTool } from "./vapi/tools/daily";

export const triggerOutboundCall = action({
    args: {
        phone: v.string(),
        type: v.union(
            v.literal("onboarding-agent"),
            v.literal("weekly-agent"),
            v.literal("evening-agent"),
            v.literal("daily-agent")
        ),
    },
    handler: async (ctx, args): Promise<any> => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthenticated");
        }

        const VAPI_API_KEY = process.env.VAPI_API_KEY;
        const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;

        // 1. Create a call session record first (Internal Mutation)
        const scheduledFor = new Date().toISOString();
        const sessionId: Id<"callSessions"> = await ctx.runMutation(internal.callSessions.createCallSession, {
            userId: userId,
            callType: (args.type === "evening-agent" ? "daily-agent" : args.type) as "onboarding-agent" | "weekly-agent" | "daily-agent",
            scheduledFor: scheduledFor,
        });

        // Select assistant ID and Tools based on requested type
        let assistantId: string | undefined;
        let tools: any[] = [];

        switch (args.type) {
            case "onboarding-agent":
                assistantId = process.env.VAPI_ASSISTANT_ID_ONBOARDING;
                tools = [saveOnboardingDataTool];
                break;
            case "weekly-agent":
                assistantId = process.env.VAPI_ASSISTANT_ID_WEEKLY;
                tools = [saveWeeklyDataTool];
                break;
            case "daily-agent":
            case "evening-agent":
                assistantId = process.env.VAPI_ASSISTANT_ID_DAILY;
                tools = [saveDailyDataTool];
                break;
            default:
                break;
        }

        if (!VAPI_API_KEY || !assistantId || !VAPI_PHONE_NUMBER_ID) {
            const errorMsg = `Vapi credentials not configured correctly for type '${args.type}'`;
            await ctx.runMutation(internal.callSessions.updateCallSessionStatus, {
                sessionId,
                status: "failed",
            });
            throw new Error(errorMsg);
        }

        console.log(`Fetching assistant config for ${assistantId}...`);

        // Fetch current assistant configuration to preserve provider/model/messages
        const assistantResponse = await fetch(
            `https://api.vapi.ai/assistant/${assistantId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${VAPI_API_KEY}`,
                },
            }
        );

        if (!assistantResponse.ok) {
            const errorText = await assistantResponse.text();
            await ctx.runMutation(internal.callSessions.updateCallSessionStatus, {
                sessionId,
                status: "failed",
            });
            throw new Error(`Failed to fetch assistant config: ${errorText}`);
        }

        const assistantData = await assistantResponse.json();

        const payload = {
            assistantId: assistantId,
            phoneNumberId: VAPI_PHONE_NUMBER_ID,
            customer: {
                number: args.phone,
            },
            assistantOverrides: {
                model: {
                    ...assistantData.model,
                    tools: tools
                }
            }
        };

        console.log(`Triggering Vapi ${args.type} call:`, JSON.stringify(payload, null, 2));

        try {
            const response = await fetch(
                `https://api.vapi.ai/call`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${VAPI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                await ctx.runMutation(internal.callSessions.updateCallSessionStatus, {
                    sessionId,
                    status: "failed",
                });
                throw new Error(`Failed to trigger Vapi call: ${errorText}`);
            }

            const data = await response.json();

            // Success! Update session with Vapi Call ID and status
            await ctx.runMutation(internal.callSessions.updateCallSessionStatus, {
                sessionId,
                status: "in_progress",
                vapiCallId: data.id,
                incrementAttempts: true
            });

            // Create initial call record so it appears in history immediately
            await ctx.runMutation(internal.calls.createCall, {
                vapiCallId: data.id,
                userId: userId,
                callSessionId: sessionId,
                status: "in-progress",
                direction: "outbound",
                startedAt: new Date().toISOString(),
                endedAt: "", // Will be updated by webhook
            });

            return data;
        } catch (error) {
            console.error("Vapi call failed", error);
            await ctx.runMutation(internal.callSessions.updateCallSessionStatus, {
                sessionId,
                status: "failed",
            });
            throw error;
        }
    },
});
