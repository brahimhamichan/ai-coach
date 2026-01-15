import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Get all call sessions for a user
export const getCallSessions = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const sessions = await ctx.db
            .query("callSessions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        return sessions;
    },
});

// Get a specific call session
export const getCallSession = query({
    args: { sessionId: v.id("callSessions") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.sessionId);
    },
});

// Get upcoming scheduled calls
export const getUpcomingCalls = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        const sessions = await ctx.db
            .query("callSessions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
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
            v.literal("onboarding"),
            v.literal("weekly"),
            v.literal("evening")
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

// Debug: Create a test call session
export const createTestCallSession = mutation({
    args: {
        userId: v.id("users"),
        callType: v.union(
            v.literal("onboarding"),
            v.literal("weekly"),
            v.literal("evening")
        ),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        const sessionId = await ctx.db.insert("callSessions", {
            userId: args.userId,
            callType: args.callType,
            scheduledFor: now,
            status: "scheduled",
            attemptsCount: 0,
        });

        return sessionId;
    },
});
