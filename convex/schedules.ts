import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get schedule for a user
export const getSchedule = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const schedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();
        return schedule;
    },
});

// Update schedule settings
export const updateSchedule = mutation({
    args: {
        userId: v.id("users"),
        onboardingTime: v.optional(v.string()),
        weeklyDay: v.optional(v.string()),
        weeklyTime: v.optional(v.string()),
        eveningDays: v.optional(v.array(v.string())),
        eveningTime: v.optional(v.string()),
        includeSaturday: v.optional(v.boolean()),
        includeSundayRecap: v.optional(v.boolean()),
        retryIntervalMinutes: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args;

        const schedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!schedule) {
            throw new Error("Schedule not found");
        }

        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined)
        );

        await ctx.db.patch(schedule._id, filteredUpdates);
    },
});
