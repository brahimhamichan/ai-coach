import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all call sessions for a user
export const getCallSessions = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const sessions = await ctx.db
            .query("callSessions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        return sessions;
    },
});

// Get a specific call session
export const getCallSession = query({
    args: { sessionId: v.id("callSessions") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const session = await ctx.db.get(args.sessionId);
        if (session?.userId !== userId) return null;

        return session;
    },
});

// Get upcoming scheduled calls
export const getUpcomingCalls = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const now = new Date().toISOString();

        const sessions = await ctx.db
            .query("callSessions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.and(
                    q.eq(q.field("status"), "scheduled"),
                    q.gte(q.field("scheduledFor"), now)
                )
            )
            .order("asc")
            .take(5);

        return sessions;
    },
});

// Create a new call session (internal - triggered by scheduler or webhook)
export const createCallSession = internalMutation({
    args: {
        userId: v.id("users"),
        callType: v.union(
            v.literal("onboarding-agent"),
            v.literal("weekly-agent"),
            v.literal("daily-agent")
        ),
        scheduledFor: v.string(),
    },
    handler: async (ctx, args) => {
        const sessionId = await ctx.db.insert("callSessions", {
            userId: args.userId,
            callType: args.callType,
            scheduledFor: args.scheduledFor,
            status: "scheduled",
            attemptsCount: 0,
        });

        return sessionId;
    },
});

// Update call session status (internal - triggered by Vapi webhook)
export const updateCallSessionStatus = internalMutation({
    args: {
        sessionId: v.id("callSessions"),
        status: v.union(
            v.literal("scheduled"),
            v.literal("in_progress"),
            v.literal("completed"),
            v.literal("missed"),
            v.literal("failed")
        ),
        vapiCallId: v.optional(v.string()),
        lastAttemptAt: v.optional(v.string()),
        nextAttemptAt: v.optional(v.string()),
        incrementAttempts: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { sessionId, incrementAttempts, ...updates } = args;

        const session = await ctx.db.get(sessionId);
        if (!session) {
            throw new Error("Session not found");
        }

        const filteredUpdates: Record<string, unknown> = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined)
        );

        if (incrementAttempts) {
            filteredUpdates.attemptsCount = session.attemptsCount + 1;
        }

        await ctx.db.patch(sessionId, filteredUpdates);
    },
});

// Internal lookup for webhook
export const getCallSessionByVapiCallId = internalQuery({
    args: { vapiCallId: v.string() },
    handler: async (ctx, args) => {
        // Assuming we didn't index vapiCallId on callSessions (schema check needed).
        // If not indexed, this might be slow/scan.
        // Schema says: .index("by_vapi_call_id", ["vapiCallId"]) ?? No.
        // Schema says: .index("by_user", ["userId"]).index("by_status", ["status"]).index("by_user_type", ["userId", "callType"])

        // Wait, I should add index if I want to look up by vapiCallId.
        // Or I can just scan if dataset is small, but that's bad practice.
        // Let's rely on finding by user phone for now if vapiCallId isn't reliable or present on session yet.

        // Actually, if we trigger the call, we update the session with vapiCallId.
        // But `updateCallSessionStatus` (which sets vapiCallId) is called AFTER trigger returns.
        // The webhook might come LATER. So session should have it.
        // BUT schema.ts does NOT have index on vapiCallId for callSessions.
        // I should add it if I want to use it here.

        // For now, I'll filter.
        const session = await ctx.db
            .query("callSessions")
            .withIndex("by_vapi_call_id", (q) => q.eq("vapiCallId", args.vapiCallId))
            .first();

        return session;
    },
});

// Debug: Create a test call session
export const createTestCallSession = mutation({
    args: {
        callType: v.union(
            v.literal("onboarding-agent"),
            v.literal("weekly-agent"),
            v.literal("daily-agent")
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        const now = new Date().toISOString();

        const sessionId = await ctx.db.insert("callSessions", {
            userId: userId,
            callType: args.callType,
            scheduledFor: now,
            status: "scheduled",
            attemptsCount: 0,
        });

        return sessionId;
    },
});

const DAY_MAP: Record<string, number> = {
    "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
    "Thursday": 4, "Friday": 5, "Saturday": 6
};

function getNextDate(now: Date, dayName: string, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const targetDay = DAY_MAP[dayName];
    const currentDay = now.getDay(); // 0 is Sunday

    let daysUntil = targetDay - currentDay;
    if (daysUntil < 0) {
        daysUntil += 7;
    }

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysUntil);
    targetDate.setHours(hours, minutes, 0, 0);

    // If the scheduled time for today has already passed, move to next week
    if (daysUntil === 0 && targetDate <= now) {
        targetDate.setDate(targetDate.getDate() + 7);
    }

    return targetDate;
}

// Get next scheduled call info
export const getNextCall = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const now = new Date();
        const nowIso = now.toISOString();

        // 1. Check for existing future sessions
        const upcomingSessions = await ctx.db
            .query("callSessions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.and(
                    q.eq(q.field("status"), "scheduled"),
                    q.gt(q.field("scheduledFor"), nowIso)
                )
            )
            .collect();

        if (upcomingSessions.length > 0) {
            // Sort by time ascending
            upcomingSessions.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
            const distinctSession = upcomingSessions[0];
            return {
                type: "scheduled",
                date: distinctSession.scheduledFor,
                callType: distinctSession.callType
            };
        }

        // 2. Fallback: Calculate from schedule
        const schedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!schedule) return null;

        let candidates: Array<{ date: Date, callType: string }> = [];

        // Weekly call candidate
        if (schedule.weeklyDay && schedule.weeklyTime) {
            candidates.push({
                date: getNextDate(now, schedule.weeklyDay, schedule.weeklyTime),
                callType: "weekly-agent"
            });
        }

        // Evening call candidates
        if (schedule.eveningDays && schedule.eveningDays.length > 0 && schedule.eveningTime) {
            for (const day of schedule.eveningDays) {
                candidates.push({
                    date: getNextDate(now, day, schedule.eveningTime),
                    callType: "daily-agent"
                });
            }
        }

        if (candidates.length === 0) return null;

        // Sort candidates and pick earliest
        candidates.sort((a, b) => a.date.getTime() - b.date.getTime());

        return {
            type: "theoretical",
            date: candidates[0].date.toISOString(),
            callType: candidates[0].callType
        };
    },
});
