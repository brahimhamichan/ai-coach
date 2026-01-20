import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }
        const user = await ctx.db.get(userId);
        return user;
    },
});

export const initializeUser = mutation({
    args: {
        timezone: v.optional(v.string()),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            console.log("initializeUser called without authentication");
            return;
        }

        const user = await ctx.db.get(userId);
        if (!user) {
            console.log("initializeUser user not found yet");
            return;
        }

        // Check if schedule exists
        const schedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!schedule) {
            // Create default schedule
            await ctx.db.insert("schedules", {
                userId,
                weeklyDay: "Sunday",
                weeklyTime: "10:00",
                eveningDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                eveningTime: "17:00",
                includeSaturday: false,
                includeSundayRecap: false,
                retryIntervalMinutes: 30,
            });
        }

        // Initialize defaults if missing or provided
        const updates: any = {};
        if (args.timezone && !user.timezone) {
            updates.timezone = args.timezone;
        } else if (!user.timezone) {
            updates.timezone = "America/Los_Angeles";
        }

        if (args.name && !user.name) {
            updates.name = args.name;
        }

        if (!user.coachingTone) {
            updates.coachingTone = "supportive";
            updates.smsEnabled = false;
            updates.pushEnabled = false;
        }

        if (Object.keys(updates).length > 0) {
            await ctx.db.patch(userId, updates);
        }
    },
});

// Internal query for webhook lookup
export const getUserByPhone = internalQuery({
    args: { phone: v.string() },
    handler: async (ctx, args) => {
        // Since phone is now optional and not unique indexed by default in auth schema (we added index though),
        // we find the first match.
        const user = await ctx.db
            .query("users")
            .withIndex("by_phone", (q) => q.eq("phone", args.phone))
            .first();
        return user;
    },
});

export const updateUser = mutation({
    args: {
        timezone: v.optional(v.string()),
        phone: v.optional(v.string()),
        whatsappPhone: v.optional(v.string()),
        coachingTone: v.optional(v.string()),
        smsEnabled: v.optional(v.boolean()),
        pushEnabled: v.optional(v.boolean()),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            console.log("updateUser called without authentication");
            return;
        }

        const updates = Object.fromEntries(
            Object.entries(args).filter(([, value]) => value !== undefined)
        );
        await ctx.db.patch(userId, updates);
    },
});
