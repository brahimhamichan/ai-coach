import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Get weekly objective for current week
export const getCurrentWeekObjective = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        // Get current week start date (Sunday)
        const now = new Date();
        const dayOfWeek = now.getDay();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);
        const weekStartDate = weekStart.toISOString().split("T")[0];

        const objective = await ctx.db
            .query("weeklyObjectives")
            .withIndex("by_user_week", (q) =>
                q.eq("userId", args.userId).eq("weekStartDate", weekStartDate)
            )
            .first();

        return objective;
    },
});

// Get weekly objectives history
export const getWeeklyObjectivesHistory = query({
    args: { userId: v.id("users"), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const objectives = await ctx.db
            .query("weeklyObjectives")
            .withIndex("by_user_week", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(args.limit ?? 10);

        return objectives;
    },
});

// Create weekly objective (internal - from Vapi webhook after weekly call)
export const createWeeklyObjective = internalMutation({
    args: {
        userId: v.id("users"),
        weekStartDate: v.string(),
        objective: v.string(),
        bottlenecks: v.array(v.string()),
        actions: v.array(v.string()),
        stopList: v.array(v.string()),
        startList: v.array(v.string()),
        continueList: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if objective already exists for this week
        const existing = await ctx.db
            .query("weeklyObjectives")
            .withIndex("by_user_week", (q) =>
                q.eq("userId", args.userId).eq("weekStartDate", args.weekStartDate)
            )
            .first();

        if (existing) {
            // Update existing objective
            await ctx.db.patch(existing._id, {
                objective: args.objective,
                bottlenecks: args.bottlenecks,
                actions: args.actions,
                stopList: args.stopList,
                startList: args.startList,
                continueList: args.continueList,
            });
            return existing._id;
        }

        // Create new objective
        return await ctx.db.insert("weeklyObjectives", {
            userId: args.userId,
            weekStartDate: args.weekStartDate,
            objective: args.objective,
            bottlenecks: args.bottlenecks,
            actions: args.actions,
            stopList: args.stopList,
            startList: args.startList,
            continueList: args.continueList,
        });
    },
});

// Note: Weekly objectives are ONLY created via Vapi webhook after weekly call
// No manual creation mutation - this is a call-owned artifact
