import { internalMutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const saveAgentData = internalMutation({
    args: {
        vapiCallId: v.string(),
        agentType: v.string(), // "onboarding", "weekly", "daily"
        data: v.any(),
    },
    handler: async (ctx, args) => {
        const { vapiCallId, agentType, data } = args;

        // 1. Resolve Session and User
        const callSession = await ctx.db
            .query("callSessions")
            .withIndex("by_vapi_call_id", (q) => q.eq("vapiCallId", vapiCallId))
            .first();

        if (!callSession) {
            console.warn(`[Agent] Could not find call session for vapiCallId: ${vapiCallId}`);
            // Fallback: Try to find user by vapiCallId in calls table? 
            // For now, we'll log and store in agentData without session if needed, or just fail.
            // But we want to capture data.
        }

        const userId = callSession?.userId;
        const callSessionId = callSession?._id;

        // 2. Generic Audit Log
        await ctx.db.insert("agentData", {
            callSessionId,
            agentType,
            data,
            timestamp: new Date().toISOString(),
        });

        if (!userId) {
            console.error("No user found for this call.");
            return { success: false, error: "User not found" };
        }

        // 3. Specialized Logic
        switch (agentType) {
            case "onboarding":
                await ctx.db.insert("visionProfiles", {
                    userId,
                    visionSummary: data.visionSummary || "",
                    motivations: data.motivations || [],
                    costOfInaction: data.costOfInaction || "",
                    commitmentDeclaration: data.commitmentDeclaration || "",
                    rawOnboardingNotes: JSON.stringify(data), // or just keep it minimal
                });
                break;

            case "weekly":
                const weekStartDate = getWeekStartDate();
                await ctx.db.insert("weeklyObjectives", {
                    userId,
                    weekStartDate,
                    objective: data.objective || "",
                    bottlenecks: data.bottlenecks || [],
                    actions: data.actions || [],
                    stopList: data.stopList || [],
                    startList: data.startList || [],
                    continueList: data.continueList || [],
                    commitmentLevel: data.commitmentLevel,
                });
                break;

            case "daily":
                // A. Review Today
                const todayStr = new Date().toISOString().split("T")[0];
                await ctx.db.insert("dailyReflections", {
                    userId,
                    date: todayStr,
                    wins: data.wins || [],
                    misses: data.misses || [],
                    blockers: data.blockers || "",
                    callSessionId,
                });

                // B. Plan Tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowStr = tomorrow.toISOString().split("T")[0];

                const actions = (data.actions || []).map((a: any) => ({
                    text: a.text,
                    why: a.why,
                    completed: false,
                }));

                await ctx.db.insert("dailyPlans", {
                    userId,
                    date: tomorrowStr,
                    actions,
                    startTime: data.startTime,
                });
                break;

            default:
                console.warn(`Unknown agent type: ${agentType}`);
        }

        return { success: true };
    },
});

function getWeekStartDate(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString().split("T")[0];
}

export const getAgentData = query({
    args: { callSessionId: v.id("callSessions") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const data = await ctx.db
            .query("agentData")
            .withIndex("by_session", (q) => q.eq("callSessionId", args.callSessionId))
            .collect();

        return data;
    },
});

