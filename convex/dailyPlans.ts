import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Get today's daily plan
export const getTodayPlan = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const today = new Date().toISOString().split("T")[0];

        const plan = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", args.userId).eq("date", today)
            )
            .first();

        return plan;
    },
});

// Get tomorrow's daily plan
export const getTomorrowPlan = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split("T")[0];

        const plan = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", args.userId).eq("date", tomorrowDate)
            )
            .first();

        return plan;
    },
});

// Get daily plans for a date range
export const getDailyPlansRange = query({
    args: {
        userId: v.id("users"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const plans = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
            .filter((q) =>
                q.and(
                    q.gte(q.field("date"), args.startDate),
                    q.lte(q.field("date"), args.endDate)
                )
            )
            .collect();

        return plans;
    },
});

// Create daily plan (internal - from Vapi webhook after evening call)
export const createDailyPlan = internalMutation({
    args: {
        userId: v.id("users"),
        date: v.string(),
        actions: v.array(v.object({
            text: v.string(),
            completed: v.optional(v.boolean()),
        })),
    },
    handler: async (ctx, args) => {
        // Check if plan already exists for this date
        const existing = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", args.userId).eq("date", args.date)
            )
            .first();

        if (existing) {
            // Update existing plan
            await ctx.db.patch(existing._id, {
                actions: args.actions,
            });
            return existing._id;
        }

        // Create new plan
        return await ctx.db.insert("dailyPlans", {
            userId: args.userId,
            date: args.date,
            actions: args.actions,
        });
    },
});

// Note: Daily plans are ONLY created via Vapi webhook after evening call
// No manual creation mutation - this is a call-owned artifact
