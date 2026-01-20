import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get call summary by ID
export const getCallSummary = query({
    args: { summaryId: v.id("callSummaries") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const summary = await ctx.db.get(args.summaryId);
        if (!summary || summary.userId !== userId) {
            return null; // Not found or unauthorized
        }
        return summary;
    },
});

// Get call summary by session ID
export const getCallSummaryBySession = query({
    args: { sessionId: v.id("callSessions") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const summary = await ctx.db
            .query("callSummaries")
            .withIndex("by_session", (q) => q.eq("callSessionId", args.sessionId))
            .first();

        if (summary && summary.userId !== userId) {
            return null;
        }

        return summary;
    },
});

// Get latest call summary for a user
export const getLatestCallSummary = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const summary = await ctx.db
            .query("callSummaries")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .first();

        return summary;
    },
});

// Get all call summaries for a user
export const getCallSummaries = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const summaries = await ctx.db
            .query("callSummaries")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .take(args.limit ?? 20);

        return summaries;
    },
});

// Create call summary (internal - from Vapi webhook)
export const createCallSummary = internalMutation({
    args: {
        userId: v.id("users"),
        callSessionId: v.id("callSessions"),
        callType: v.union(
            v.literal("onboarding-agent"),
            v.literal("weekly-agent"),
            v.literal("daily-agent")
        ),
        timestamp: v.string(),
        summaryText: v.string(),
        extractedData: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const summaryId = await ctx.db.insert("callSummaries", {
            userId: args.userId,
            callSessionId: args.callSessionId,
            callType: args.callType,
            timestamp: args.timestamp,
            summaryText: args.summaryText,
            extractedData: args.extractedData,
            locked: false,
        });

        return summaryId;
    },
});

// Update call summary with user edits
export const updateCallSummary = mutation({
    args: {
        summaryId: v.id("callSummaries"),
        userEditsText: v.string(),
        lock: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        const summary = await ctx.db.get(args.summaryId);
        if (!summary) {
            throw new Error("Summary not found");
        }

        if (summary.userId !== userId) {
            throw new Error("Unauthorized");
        }

        if (summary.locked) {
            throw new Error("Summary is locked and cannot be edited");
        }

        await ctx.db.patch(args.summaryId, {
            userEditsText: args.userEditsText,
            locked: args.lock ?? false,
        });
    },
});

// Debug: Create a test call summary
export const createTestCallSummary = mutation({
    args: {
        callSessionId: v.id("callSessions"),
        callType: v.union(
            v.literal("onboarding-agent"),
            v.literal("weekly-agent"),
            v.literal("daily-agent")
        ),
        summaryText: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        const now = new Date().toISOString();

        const summaryId = await ctx.db.insert("callSummaries", {
            userId: userId,
            callSessionId: args.callSessionId,
            callType: args.callType,
            timestamp: now,
            summaryText: args.summaryText,
            locked: false,
        });

        return summaryId;
    },
});
