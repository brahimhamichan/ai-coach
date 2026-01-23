import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const seedDemoData = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const now = new Date();
        const today = now.toISOString().split("T")[0];

        // 1. Seed Vision Profile
        const existingVision = await ctx.db
            .query("visionProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!existingVision) {
            await ctx.db.insert("visionProfiles", {
                userId,
                visionSummary: "I want to build a sustainable $10k/MRR SaaS business while maintaining a healthy work-life balance. My goal is to launch 'TaskFlow' by the end of Q2 and acquire my first 100 paying customers.",
                motivations: [
                    "Financial Freedom: Quit my 9-5 job.",
                    "Impact: Help others organize their lives."
                ],
                costOfInaction: "I'll be stuck in the same corporate loop for another year, feeling unfulfilled and regretful.",
                commitmentDeclaration: "I commit to spending 2 focused hours every morning on my business, no matter what.",
            });
        }

        // 2. Seed Weekly Objective
        // Calculate the start of the current week (Sunday)
        const day = now.getDay(); // 0 is Sunday
        const diff = now.getDate() - day;
        const startOfWeek = new Date(now);
        startOfWeek.setDate(diff);
        const weekStartDate = startOfWeek.toISOString().split("T")[0];

        const existingWeekly = await ctx.db
            .query("weeklyObjectives")
            .withIndex("by_user_week", (q) => q.eq("userId", userId).eq("weekStartDate", weekStartDate))
            .first();

        if (!existingWeekly) {
            await ctx.db.insert("weeklyObjectives", {
                userId,
                weekStartDate,
                objective: "Complete the MVP Core Features (Auth, Dashboard, Settings)",
                bottlenecks: [
                    "Distractions from social media",
                    "Perfectionism on UI details",
                    "Unexpected bug fixes"
                ],
                actions: [
                    "Implement Authentication flow",
                    "Build Dashboard layout",
                    "Setup Billing integration"
                ],
                stopList: ["Checking email before 10 AM"],
                startList: ["Using Pomodoro technique"],
                continueList: ["Daily standups with myself"],
                commitmentLevel: 9,
            });
        }

        // 3. Seed Daily Plan for Today
        const existingDaily = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", today))
            .first();

        if (!existingDaily) {
            await ctx.db.insert("dailyPlans", {
                userId,
                date: today,
                actions: [
                    { text: "Finish the login page design", why: "Crucial for user onboarding", completed: false },
                    { text: "Write tests for API endpoints", why: "Prevent regressions", completed: false },
                    { text: "Research Stripe integration docs", why: "Needed for next week", completed: true }
                ],
                startTime: "09:00",
            });
        }

        // 4. Ensure User is Onboarded
        await ctx.db.patch(userId, {
            onboarded: true,
            name: "Demo User",
        });

        // Ensure Schedule exists
        const existingSchedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!existingSchedule) {
            await ctx.db.insert("schedules", {
                userId,
                weeklyDay: "Sunday",
                weeklyTime: "10:00",
                eveningDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                eveningTime: "17:00",
                includeSaturday: false,
                includeSundayRecap: true,
                retryIntervalMinutes: 30,
            });
        }
    },
});
