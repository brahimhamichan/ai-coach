import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get schedule for a user
export const getSchedule = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const schedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();
        return schedule;
    },
});

// Update schedule settings
export const updateSchedule = mutation({
    args: {
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
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const schedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!schedule) {
            throw new Error("Schedule not found");
        }

        const filteredUpdates = Object.fromEntries(
            Object.entries(args).filter(([, value]) => value !== undefined)
        );

        await ctx.db.patch(schedule._id, filteredUpdates);
    },
});
