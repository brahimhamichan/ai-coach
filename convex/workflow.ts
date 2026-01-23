import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current workflow state for a user
export const getCurrentWorkflowState = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const today = now.toISOString().split("T")[0];

        // Get user's schedule
        const schedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q: any) => q.eq("userId", userId))
            .first();

        if (!schedule) {
            return {
                state: "no_schedule",
                currentDay,
                currentHour,
                today
            };
        }

        // Check if daily plan exists for today
        const todayPlan = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId).eq("date", today)
            )
            .first();

        // Check if weekly objective exists for current week
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - currentDay);
        weekStart.setHours(0, 0, 0, 0);
        const weekStartDate = weekStart.toISOString().split("T")[0];

        const weeklyObjective = await ctx.db
            .query("weeklyObjectives")
            .withIndex("by_user_week", (q) =>
                q.eq("userId", userId).eq("weekStartDate", weekStartDate)
            )
            .first();

        // Determine workflow state
        if (currentHour >= 17 && currentHour <= 20) {
            // Evening hours - time for daily plan
            if (!todayPlan || todayPlan.actions.length === 0) {
                return {
                    state: "needs_daily_plan",
                    currentDay,
                    currentHour,
                    today,
                    schedule: schedule.eveningTime
                };
            }
            return {
                state: "daily_plan_complete",
                currentDay,
                currentHour,
                today,
                plan: todayPlan
            };
        }

        if (currentDay === 0 && currentHour >= 9 && currentHour <= 11) {
            // Sunday morning - time for weekly review
            if (!weeklyObjective) {
                return {
                    state: "needs_weekly_review",
                    currentDay,
                    currentHour,
                    today,
                    schedule: schedule.weeklyTime
                };
            }
            return {
                state: "weekly_objective_set",
                currentDay,
                currentHour,
                today,
                objective: weeklyObjective
            };
        }

        // Check if we need daily actions planning
        if (!todayPlan && currentHour >= 20) {
            return {
                state: "needs_tomorrow_plan",
                currentDay,
                currentHour,
                today,
                schedule: schedule.eveningTime
            };
        }

        return {
            state: "idle",
            currentDay,
            currentHour,
            today
        };
    },
});