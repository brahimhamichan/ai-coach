import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Get commitment logs for a user
export const getCommitmentLogs = query({
    args: { userId: v.id("users"), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const logs = await ctx.db
            .query("commitmentLogs")
            .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(args.limit ?? 30);

        return logs;
    },
});

// Get commitment logs for a specific date
export const getCommitmentLogsForDate = query({
    args: { userId: v.id("users"), date: v.string() },
    handler: async (ctx, args) => {
        const logs = await ctx.db
            .query("commitmentLogs")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", args.userId).eq("date", args.date)
            )
            .collect();

        return logs;
    },
});

// Create commitment log (internal - from Vapi webhook)
export const createCommitmentLog = internalMutation({
    args: {
        userId: v.id("users"),
        date: v.string(),
        type: v.union(v.literal("weekly"), v.literal("daily")),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const logId = await ctx.db.insert("commitmentLogs", {
            userId: args.userId,
            date: args.date,
            type: args.type,
            text: args.text,
        });

        return logId;
    },
});
