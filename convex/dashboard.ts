import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDashboardData = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        // 1. Vision
        const visionProfile = await ctx.db
            .query("visionProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        // 2. Weekly Objective (Current Week)
        // For simplicity, we'll just get the most recent one for now
        const weeklyObjective = await ctx.db
            .query("weeklyObjectives")
            .withIndex("by_user_week", (q) => q.eq("userId", userId))
            .order("desc")
            .first();

        // 3. Next Session (Scheduled)
        const nextSession = await ctx.db
            .query("callSessions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("status"), "scheduled"))
            // We can't sort by time easily with just this index if we filter in-memory,
            // but let's fetch pending ones and sort in JS for now as there won't be many.
            .collect();

        // Sort by scheduledFor ascending
        nextSession.sort((a, b) =>
            new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
        );
        const nextCall = nextSession[0];

        // 4. Next Actions (Daily Plan for Today or latest)
        const dailyPlan = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) => q.eq("userId", userId))
            .order("desc")
            .first();

        return {
            vision: visionProfile,
            weeklyObjective: weeklyObjective,
            nextSession: nextCall,
            dailyPlan: dailyPlan,
        };
    },
});

export const updateVision = mutation({
    args: {
        visionSummary: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("visionProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                visionSummary: args.visionSummary,
            });
        } else {
            await ctx.db.insert("visionProfiles", {
                userId,
                visionSummary: args.visionSummary,
                motivations: [], // defaults
                costOfInaction: "",
                commitmentDeclaration: "",
            });
        }
    },
});

export const addNextAction = mutation({
    args: {
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const today = new Date().toISOString().split("T")[0];

        const existingPlan = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", today))
            .first();

        if (existingPlan) {
            await ctx.db.patch(existingPlan._id, {
                actions: [...existingPlan.actions, { text: args.text, completed: false }],
            });
        } else {
            // Create new plan if none exists for today (or could append to latest, but "Today" is better)
            // Actually, if we want to "Add Action" to the list displayed, we should probably add to the *displayed* plan.
            // But for now, ensuring a plan for "today" is a safe default for "add action".
            await ctx.db.insert("dailyPlans", {
                userId,
                date: today,
                actions: [{ text: args.text, completed: false }],
            });
        }
    },
});

export const toggleActionComplete = mutation({
    args: {
        planId: v.id("dailyPlans"),
        actionIndex: v.number(),
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const plan = await ctx.db.get(args.planId);
        if (!plan || plan.userId !== userId) throw new Error("Plan not found");

        const newActions = [...plan.actions];
        if (newActions[args.actionIndex]) {
            newActions[args.actionIndex].completed = args.completed;
        }

        await ctx.db.patch(args.planId, {
            actions: newActions,
        });
    }
});
