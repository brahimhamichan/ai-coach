import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get historical daily plans with pagination
export const getPastPlans = query({
    args: {
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        let plansQuery = ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q: any) => q.eq("userId", userId))
            .order("desc");

        // Apply date range filters if provided
        if (args.startDate || args.endDate) {
            plansQuery = plansQuery.filter((q: any) => {
                const conditions = [];
                if (args.startDate) {
                    conditions.push(q.gte(q.field("date"), args.startDate));
                }
                if (args.endDate) {
                    conditions.push(q.lte(q.field("date"), args.endDate));
                }
                return conditions.length > 0 ? q.and(...conditions) : q;
            });
        }

        // Apply limit
        const plans = await (args.limit 
            ? plansQuery.take(args.limit)
            : plansQuery.collect());

        return plans;
    },
});

// Get completion statistics
export const getCompletionStats = query({
    args: {
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        let plansQuery = ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q: any) => q.eq("userId", userId))
            .order("desc");

        // Apply date range filters if provided
        if (args.startDate || args.endDate) {
            plansQuery = plansQuery.filter((q: any) => {
                const conditions = [];
                if (args.startDate) {
                    conditions.push(q.gte(q.field("date"), args.startDate));
                }
                if (args.endDate) {
                    conditions.push(q.lte(q.field("date"), args.endDate));
                }
                return conditions.length > 0 ? q.and(...conditions) : q;
            });
        }

        const plans = await plansQuery.collect();

        if (plans.length === 0) {
            return {
                totalPlans: 0,
                completedPlans: 0,
                completionRate: 0,
                streakDays: 0
            };
        }

        // Calculate completion statistics
        let completedPlans = 0;
        let streakDays = 0;
        let currentStreak = 0;

        for (let i = 0; i < plans.length; i++) {
            const plan = plans[i];
            const allActionsCompleted = plan.actions.every(action => action.completed);
            
            if (allActionsCompleted) {
                completedPlans++;
                currentStreak++;
            } else {
                currentStreak = 0;
            }

            // Check for consecutive days (simplified - just count backwards from today)
            if (i === 0 || plans[i - 1].date !== plan.date) {
                streakDays = 1;
            } else if (allActionsCompleted && plans[i - 1].actions.every(a => a.completed)) {
                streakDays++;
            }
        }

        const completionRate = Math.round((completedPlans / plans.length) * 100);

        return {
            totalPlans: plans.length,
            completedPlans,
            completionRate,
            streakDays,
            currentStreak
        };
    },
});