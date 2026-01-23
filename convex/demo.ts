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

        // 5. Seed Call Sessions (History & Future)
        const existingSessions = await ctx.db
            .query("callSessions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!existingSessions) {
            // Past Onboarding Call (Completed)
            const onboardingDate = new Date(now);
            onboardingDate.setDate(onboardingDate.getDate() - 3); // 3 days ago
            const onboardingId = await ctx.db.insert("callSessions", {
                userId,
                callType: "onboarding-agent",
                scheduledFor: onboardingDate.toISOString(),
                status: "completed",
                attemptsCount: 1,
                vapiCallId: "demo-call-onboarding",
            });

            // Past Weekly Call (Last Sunday)
            const lastSunday = new Date(startOfWeek);
            lastSunday.setHours(10, 0, 0, 0);
            const weeklyId = await ctx.db.insert("callSessions", {
                userId,
                callType: "weekly-agent",
                scheduledFor: lastSunday.toISOString(),
                status: "completed",
                attemptsCount: 1,
                vapiCallId: "demo-call-weekly",
            });

            // Past Daily Call (Yesterday Evening)
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(17, 0, 0, 0);
            const dailyId = await ctx.db.insert("callSessions", {
                userId,
                callType: "daily-agent",
                scheduledFor: yesterday.toISOString(),
                status: "completed",
                attemptsCount: 1,
                vapiCallId: "demo-call-daily-prev",
            });

            // Future Daily Call (Today Evening)
            const todayEvening = new Date(now);
            todayEvening.setHours(17, 0, 0, 0);

            // Only schedule if it's in the future, otherwise schedule for tomorrow
            if (todayEvening < now) {
                todayEvening.setDate(todayEvening.getDate() + 1);
            }

            await ctx.db.insert("callSessions", {
                userId,
                callType: "daily-agent",
                scheduledFor: todayEvening.toISOString(),
                status: "scheduled",
                attemptsCount: 0,
            });

            // 6. Seed Call Logs (for history display)
            // Onboarding Call
            await ctx.db.insert("calls", {
                vapiCallId: "demo-call-onboarding",
                userId,
                callSessionId: onboardingId,
                status: "completed",
                direction: "outbound",
                startedAt: onboardingDate.toISOString(),
                endedAt: new Date(onboardingDate.getTime() + 15 * 60000).toISOString(), // 15 mins
                durationSeconds: 900,
                recordingUrl: "https://example.com/demo-recording.mp3", // Placeholder
                summary: "User successfully onboarded. Defined vision for 'TaskFlow' SaaS and motivations around financial freedom.",
                transcription: "Coach: Hi there! Welcome to AI Coach. I'm here to help you turn your goals into reality. To get started, I'd love to understand your big vision. What are you building?\nUser: Hi! I'm building a SaaS called TaskFlow. It's a project management tool for creative agencies.\nCoach: That sounds exciting! What's the ultimate goal with TaskFlow?\nUser: I want to reach $10k MRR so I can quit my corporate job and have more freedom.\nCoach: Financial freedom is a powerful motivator. Why is this specific goal important to you right now?\nUser: To be honest, I'm burning out at my current job. Avoiding burnout and gaining autonomy are huge.\nCoach: I hear you. Let's lock that in. We'll focus on getting you to that $10k mark with consistent execution. Ready to commit?\nUser: 100%. Let's do it.",
            });

            // Weekly Call
            await ctx.db.insert("calls", {
                vapiCallId: "demo-call-weekly",
                userId,
                callSessionId: weeklyId,
                status: "completed",
                direction: "outbound",
                startedAt: lastSunday.toISOString(),
                endedAt: new Date(lastSunday.getTime() + 20 * 60000).toISOString(), // 20 mins
                durationSeconds: 1200,
                summary: "Structured the week ahead. Focus is on MVP Core Features. Identified social media distractions as a key bottleneck.",
                transcription: "Coach: Happy Sunday! Let's look at the week ahead. What's your main focus?\nUser: This week is all about the MVP. I need to finish the authentication and the basic dashboard.\nCoach: Solid focus. What potential bottlenecks do you see getting in the way?\nUser: I tend to get distracted by social media when the code gets tough. Also, I might overthink the UI design.\nCoach: Perfectionism and distractions—classic enemies of shipping. Let's put some guardrails in place. Maybe we block social media during deep work blocks?\nUser: Yeah, I'll use a blocker.\nCoach: Great. So, the objective is 'Complete MVP Core Features'. Commit to that?\nUser: Yes, I'm at 9/10 commitment.",
            });

            // Daily Call (Yesterday)
            await ctx.db.insert("calls", {
                vapiCallId: "demo-call-daily-prev",
                userId,
                callSessionId: dailyId,
                status: "completed",
                direction: "outbound",
                startedAt: yesterday.toISOString(),
                endedAt: new Date(yesterday.getTime() + 10 * 60000).toISOString(), // 10 mins
                durationSeconds: 600,
                summary: "Reviewed daily progress. Completed login page design but missed API tests due to a meeting. Moved tests to tomorrow.",
                transcription: "Coach: Good evening! How did today go with the login page?\nUser: It went well! I finished the design and the frontend code.\nCoach: That's a win! Did you get to the API tests?\nUser: Not yet. I got pulled into a meeting.\nCoach: Okay, so that's a miss for today. Is it a blocker for tomorrow?\nUser: No, I can do it first thing tomorrow morning.\nCoach: Perfect. Let's prioritize that. Anything else for tomorrow?\nUser: I need to read the Stripe docs.\nCoach: Got it. API tests and Stripe docs. Let's crush it tomorrow!",
            });

            // 7. Seed Call Summaries (for detail view "Data" tab)
            // Onboarding Summary
            await ctx.db.insert("callSummaries", {
                userId,
                callSessionId: onboardingId,
                callType: "onboarding-agent",
                timestamp: onboardingDate.toISOString(),
                summaryText: "User successfully onboarded. Defined vision for 'TaskFlow' SaaS and motivations around financial freedom.",
                locked: true,
                extractedData: {
                    visionSummary: "I want to build a sustainable $10k/MRR SaaS business while maintaining a healthy work-life balance. My goal is to launch 'TaskFlow' by the end of Q2 and acquire my first 100 paying customers.",
                    motivations: ["Financial Freedom: Quit my 9-5 job.", "Impact: Help others organize their lives."],
                    costOfInaction: "I'll be stuck in the same corporate loop for another year, feeling unfulfilled and regretful.",
                    commitmentDeclaration: "I commit to spending 2 focused hours every morning on my business, no matter what."
                }
            });

            // Weekly Summary
            await ctx.db.insert("callSummaries", {
                userId,
                callSessionId: weeklyId,
                callType: "weekly-agent",
                timestamp: lastSunday.toISOString(),
                summaryText: "Structured the week ahead. Focus is on MVP Core Features. Identified social media distractions as a key bottleneck.",
                locked: true,
                extractedData: {
                    objective: "Complete the MVP Core Features (Auth, Dashboard, Settings)",
                    bottlenecks: ["Distractions from social media", "Perfectionism on UI details", "Unexpected bug fixes"],
                    actions: ["Implement Authentication flow", "Build Dashboard layout", "Setup Billing integration"],
                    stopList: ["Checking email before 10 AM"],
                    startList: ["Using Pomodoro technique"],
                    continueList: ["Daily standups with myself"],
                    commitmentLevel: 9
                }
            });

            // Daily Summary
            await ctx.db.insert("callSummaries", {
                userId,
                callSessionId: dailyId,
                callType: "daily-agent",
                timestamp: yesterday.toISOString(),
                summaryText: "Reviewed daily progress. Completed login page design but missed API tests due to a meeting. Moved tests to tomorrow.",
                locked: true,
                extractedData: {
                    wins: ["Finished the login page design", "Implemented frontend code"],
                    misses: ["Write tests for API endpoints"],
                    blockers: "Unexpected team meeting took up afternoon focus block",
                    planForTomorrow: [
                        { text: "Write tests for API endpoints", why: "Rollover from today" },
                        { text: "Research Stripe integration docs", why: "Needed for next week" }
                    ]
                }
            });
        }

        // 7. Seed Notifications
        const existingNotifs = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!existingNotifs) {
            await ctx.db.insert("notifications", {
                userId,
                type: "alert",
                message: "Welcome to AI Coach! Your first call is scheduled.",
                sentAt: Date.now() - 3 * 86400000,
                status: "sent",
            });
            await ctx.db.insert("notifications", {
                userId,
                type: "reminder",
                message: "Upcoming call: Daily Review at 5:00 PM",
                sentAt: Date.now(),
                status: "sent",
            });
        }
    },
});

export const resetDemoOnboarding = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const user = await ctx.db.get(userId);
        if (!user || user.email !== "demo@example.com") {
            throw new Error("Unauthorized: Only the demo user can reset onboarding.");
        }

        // 1. Delete Vision Profile
        const vision = await ctx.db
            .query("visionProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();
        if (vision) await ctx.db.delete(vision._id);

        // 2. Delete Schedule
        const schedule = await ctx.db
            .query("schedules")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();
        if (schedule) await ctx.db.delete(schedule._id);

        // 3. Delete Weekly Objectives
        const weekly = await ctx.db
            .query("weeklyObjectives")
            .withIndex("by_user_week", (q) => q.eq("userId", userId))
            .collect();
        for (const w of weekly) await ctx.db.delete(w._id);

        // 4. Delete Daily Plans
        const daily = await ctx.db
            .query("dailyPlans")
            .withIndex("by_user_date", (q) => q.eq("userId", userId))
            .collect();
        for (const d of daily) await ctx.db.delete(d._id);

        // 5. Delete Call Sessions
        const sessions = await ctx.db
            .query("callSessions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
        for (const s of sessions) await ctx.db.delete(s._id);

        // 6. Delete Calls (Logs)
        const calls = await ctx.db
            .query("calls")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
        for (const c of calls) await ctx.db.delete(c._id);

        // 7. Delete Call Summaries
        const summaries = await ctx.db
            .query("callSummaries")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
        for (const s of summaries) await ctx.db.delete(s._id);

        // 8. Delete Notifications
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
        for (const n of notifications) await ctx.db.delete(n._id);

        // 9. Reset User State
        await ctx.db.patch(userId, {
            onboarded: false,
            // Keep name for convenience or clear it if strict reset is needed:
            // name: undefined, 
        });
    },
});
