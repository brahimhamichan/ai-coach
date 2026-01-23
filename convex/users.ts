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

export const completeOnboarding = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");
        await ctx.db.patch(userId, { onboarded: true });
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

export const initiatePhoneVerification = mutation({
    args: {
        phone: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // In a real implementation, you would send this via SMS service
        // For now, we'll store it and return success
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        // Store verification code temporarily (in production, use a separate table)
        await ctx.db.patch(userId, {
            phoneVerificationCode: verificationCode,
            phoneVerificationExpires: expiresAt,
        });
        
        console.log(`Verification code for ${args.phone}: ${verificationCode}`);
        
        // Return success (in production, this would be sent via SMS)
        return { success: true, message: "Verification code sent" };
    },
});

export const verifyPhoneCode = mutation({
    args: {
        phone: v.string(),
        code: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const user = await ctx.db.get(userId);
        if (!user) throw new Error("User not found");

        // Check if code matches and hasn't expired
        if (!user.phoneVerificationCode || !user.phoneVerificationExpires) {
            throw new Error("No verification code found. Please request a new one.");
        }

        if (user.phoneVerificationExpires < Date.now()) {
            throw new Error("Verification code has expired. Please request a new one.");
        }

        if (user.phoneVerificationCode !== args.code) {
            throw new Error("Invalid verification code.");
        }

        // Code is valid - save phone number and clear verification fields
        await ctx.db.patch(userId, {
            phone: args.phone,
            phoneVerificationTime: Date.now(),
            phoneVerificationCode: undefined,
            phoneVerificationExpires: undefined,
        });

        return { success: true, message: "Phone number verified" };
    },
});
