import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Hardcoded user ID for MVP - no auth required
// This will be created on first app load if it doesn't exist
export const STUB_USER_ID = "stub_user_001";

// Get the stub user (or null if not created yet)
export const getStubUser = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return users[0] ?? null;
    },
});

// Internal query for webhook handler
export const getStubUserInternal = internalQuery({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return users[0] ?? null;
    },
});

// Create the stub user for MVP
export const createStubUser = mutation({
    args: {
        phone: v.string(),
        timezone: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existing = await ctx.db.query("users").collect();
        if (existing.length > 0) {
            return existing[0]._id;
        }

        // Create new stub user
        const userId = await ctx.db.insert("users", {
            phone: args.phone,
            timezone: args.timezone,
            coachingTone: "supportive",
            smsEnabled: false,
            pushEnabled: false,
        });

        // Create default schedule for the user
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

        return userId;
    },
});

// Update user settings
export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        timezone: v.optional(v.string()),
        coachingTone: v.optional(v.string()),
        smsEnabled: v.optional(v.boolean()),
        pushEnabled: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args;
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined)
        );
        await ctx.db.patch(userId, filteredUpdates);
    },
});
