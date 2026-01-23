import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get vision profile for a user
export const getVisionProfile = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const vision = await ctx.db
            .query("visionProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();
        return vision;
    },
});

// Public mutation for frontend onboarding
export const saveVisionProfile = mutation({
    args: {
        visionSummary: v.string(),
        motivations: v.array(v.string()),
        costOfInaction: v.string(),
        commitmentDeclaration: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("visionProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, args);
            return existing._id;
        }

        return await ctx.db.insert("visionProfiles", {
            userId,
            ...args,
        });
    },
});

// Create vision profile (internal - from Vapi webhook after onboarding)
export const createVisionProfile = internalMutation({
    args: {
        userId: v.id("users"),
        visionSummary: v.string(),
        motivations: v.array(v.string()),
        costOfInaction: v.string(),
        commitmentDeclaration: v.string(),
        rawOnboardingNotes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if vision profile already exists
        const existing = await ctx.db
            .query("visionProfiles")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();

        if (existing) {
            // Update existing profile
            await ctx.db.patch(existing._id, {
                visionSummary: args.visionSummary,
                motivations: args.motivations,
                costOfInaction: args.costOfInaction,
                commitmentDeclaration: args.commitmentDeclaration,
                rawOnboardingNotes: args.rawOnboardingNotes,
            });
            return existing._id;
        }

        // Create new profile
        return await ctx.db.insert("visionProfiles", {
            userId: args.userId,
            visionSummary: args.visionSummary,
            motivations: args.motivations,
            costOfInaction: args.costOfInaction,
            commitmentDeclaration: args.commitmentDeclaration,
            rawOnboardingNotes: args.rawOnboardingNotes,
        });
    },
});
