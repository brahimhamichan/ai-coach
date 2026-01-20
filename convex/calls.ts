import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createCall = internalMutation({
    args: {
        vapiCallId: v.string(),
        userId: v.id("users"),
        callSessionId: v.optional(v.id("callSessions")),
        status: v.string(),
        direction: v.string(),
        startedAt: v.string(),
        endedAt: v.string(),
        durationSeconds: v.optional(v.number()),
        recordingUrl: v.optional(v.string()),
        transcription: v.optional(v.string()),
        summary: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if call already exists to avoid duplicates if VAPI retries webhook
        const existing = await ctx.db
            .query("calls")
            .withIndex("by_vapi_call_id", (q) => q.eq("vapiCallId", args.vapiCallId))
            .first();

        if (existing) {
            // Update existing call
            return await ctx.db.patch(existing._id, args);
        }

        return await ctx.db.insert("calls", args);
    },
});

export const getCalls = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            // Return empty pagination result if not authenticated
            return {
                page: [],
                isDone: true,
                continueCursor: "",
            };
        }

        return await ctx.db
            .query("calls")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .paginate(args.paginationOpts);
    },
});

export const getCall = query({
    args: {
        callId: v.id("calls"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const call = await ctx.db.get(args.callId);
        if (call?.userId !== userId) return null;

        return call;
    },
});
