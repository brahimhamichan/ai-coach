import { query, internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get today's daily plan
export const getTodayPlan = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const today = new Date().toISOString().split("T")[0];

        const plan = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", today)
            )
            .first();

        return plan;
    },
});

// Get tomorrow's daily plan
export const getTomorrowPlan = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split("T")[0];

        const plan = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", tomorrowDate)
            )
            .first();

        return plan;
    },
});

// Get daily plans for a date range
export const getDailyPlansRange = query({
    args: {
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const plans = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) => q.eq("userId", userId))
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

// Create daily plan manually (for user entry)
export const createManualDailyPlan = mutation({
    args: {
        date: v.string(),
        actions: v.array(v.object({
            text: v.string(),
            completed: v.optional(v.boolean()),
        })),
        startTime: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if plan already exists for this date
        const existing = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .first();

        if (existing) {
            // Update existing plan
            await ctx.db.patch(existing._id, {
                actions: args.actions,
                startTime: args.startTime,
            });
            return existing._id;
        }

        // Create new plan
        return await ctx.db.insert("dailyPlans", {
            userId,
            date: args.date,
            actions: args.actions,
            startTime: args.startTime,
        });
    },
});

// Add single action to today's plan
export const addNextAction = mutation({
    args: {
        text: v.string(),
        date: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const targetDate = args.date || new Date().toISOString().split("T")[0];

        const existingPlan = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", targetDate)
            )
            .first();

        if (existingPlan) {
            await ctx.db.patch(existingPlan._id, {
                actions: [...existingPlan.actions, { text: args.text, completed: false }],
            });
        } else {
            // Create new plan if none exists for today
            await ctx.db.insert("dailyPlans", {
                userId,
                date: targetDate,
                actions: [{ text: args.text, completed: false }],
            });
        }
    },
});

// Toggle action completion status
export const toggleActionCompletion = mutation({
    args: {
        id: v.id("dailyPlans"),
        actionIndex: v.number(),
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const plan = await ctx.db.get(args.id);
        if (!plan) throw new Error("Plan not found");

        if (plan.userId !== userId) throw new Error("Unauthorized");

        const actions = [...plan.actions];
        if (args.actionIndex < 0 || args.actionIndex >= actions.length) {
            throw new Error("Invalid action index");
        }

        actions[args.actionIndex] = {
            ...actions[args.actionIndex],
            completed: args.completed,
        };

        await ctx.db.patch(args.id, { actions });
    },
});

// Note: Daily plans are primarily created via Vapi webhook after evening call
// Manual creation is available for user convenience
