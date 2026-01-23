import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Create User
        const existingUser = await ctx.db.query("users").first();
        let userId = existingUser?._id;

        if (!userId) {
            userId = await ctx.db.insert("users", {
                phone: "+1234567890",
                timezone: "America/New_York",
                coachingTone: "supportive",
                smsEnabled: true,
                pushEnabled: false,
            });
        }

        // 2. Create Schedule
        const existingSchedule = await ctx.db.query("schedules").withIndex("by_user", (q) => q.eq("userId", userId)).first();
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

        // 3. Create Vision Profile
        const existingVision = await ctx.db.query("visionProfiles").withIndex("by_user", (q) => q.eq("userId", userId)).first();
        if (!existingVision) {
            await ctx.db.insert("visionProfiles", {
                userId,
                visionSummary: "To build a sustainable SaaS business that provides freedom and impacts ADHD entrepreneurs.",
                motivations: ["Independence", "Creative Problem Solving", "Helping Others"],
                costOfInaction: "Staying stuck in a corporate job and never reaching my full potential.",
                commitmentDeclaration: "I commit to 3 high-leverage actions every day.",
            });
        }

        // 4. Create Weekly Objectives
        const existingWeekly = await ctx.db.query("weeklyObjectives").withIndex("by_user_week", (q) => q.eq("userId", userId)).first();
        if (!existingWeekly) {
            await ctx.db.insert("weeklyObjectives", {
                userId,
                weekStartDate: "2024-03-17",
                objective: "Launch the MVP landing page",
                bottlenecks: ["Decision paralysis on copy", "Tweaking CSS instead of shipping", "Social media distractions"],
                actions: ["Write hero section copy", "Setup Vercel deployment", "Connect domain"],
                stopList: ["Infinite scrolling", "Starting new tutorials"],
                startList: ["Using a timer for tasks", "Deep work blocks"],
                continueList: ["Daily exercise", "Meditation"],
            });
        }

        // 5. Create Daily Plans
        const existingDaily = await ctx.db.query("dailyPlans").withIndex("by_user_date", (q) => q.eq("userId", userId)).first();
        if (!existingDaily) {
            await ctx.db.insert("dailyPlans", {
                userId,
                date: "2024-03-18",
                actions: [
                    { text: "Finish landing page copy", completed: true },
                    { text: "Setup database schema", completed: false },
                    { text: "Send 3 outreach emails", completed: false },
                ],
            });
        }

        return { userId, message: "Seed successful!" };
    },
});

