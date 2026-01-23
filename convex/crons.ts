import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Cron job to schedule calls based on user schedules
// This runs every hour to check if any calls need to be scheduled
export const scheduleCalls = mutation({
    args: {},
    handler: async (ctx) => {
        console.log("Running scheduleCalls cron job");

        const now = new Date();
        const currentHour = now.getHours(); // UTC hours
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const today = now.toISOString().split("T")[0]; // YYYY-MM-DD

        // Get all users with schedules
        const allUsers = await ctx.db.query("users").collect();

        for (const user of allUsers) {
            if (!user.onboarded) {
                continue; // Skip users who haven't completed onboarding
            }

            // Get user's schedule
            const schedule = await ctx.db
                .query("schedules")
                .withIndex("by_user", (q: any) => q.eq("userId", user._id))
                .first();

            if (!schedule) {
                continue; // Skip users without schedules
            }

            // Check for weekly call (Sunday by default)
            if (schedule.weeklyDay && schedule.weeklyTime) {
                const dayName = schedule.weeklyDay;
                const dayMap: Record<string, number> = {
                    "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
                    "Thursday": 4, "Friday": 5, "Saturday": 6
                };

                const targetDay = dayMap[dayName];
                if (targetDay !== undefined && currentDay === targetDay) {
                    const [targetHour, targetMinute] = schedule.weeklyTime.split(":").map(Number);

                    // Schedule within a 1-hour window to account for cron precision
                    if (Math.abs(currentHour - targetHour) <= 1) {
                        await checkAndScheduleCall(
                            ctx,
                            user._id,
                            "weekly-agent",
                            today,
                            schedule.weeklyTime
                        );
                    }
                }
            }

            // Check for evening calls (daily)
            if (schedule.eveningDays && schedule.eveningDays.length > 0 && schedule.eveningTime) {
                const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const currentDayName = dayNames[currentDay];

                if (schedule.eveningDays.includes(currentDayName)) {
                    const [targetHour, targetMinute] = schedule.eveningTime.split(":").map(Number);

                    // Schedule within a 1-hour window
                    if (Math.abs(currentHour - targetHour) <= 1) {
                        await checkAndScheduleCall(
                            ctx,
                            user._id,
                            "daily-agent",
                            today,
                            schedule.eveningTime
                        );
                    }
                }
            }
        }

        console.log("scheduleCalls cron job completed");
    },
});

const crons = cronJobs();
crons.interval(
    "schedule-calls",
    { minutes: 60 }, // Run every hour
    internal.crons.scheduleCalls
);

export default crons;

// Helper function to check and schedule a call with idempotency
async function checkAndScheduleCall(
    ctx: any,
    userId: Id<"users">,
    callType: "weekly-agent" | "daily-agent",
    date: string,
    time: string
) {
    // Get all sessions for this user and type, then filter in memory
    const allSessions = await ctx.db
        .query("callSessions")
        .withIndex("by_user_type", (q: any) =>
            q.eq("userId", userId).eq("callType", callType)
        )
        .collect();

    const existingSession = allSessions.find((session: any) => {
        const sessionDate = session.scheduledFor.split("T")[0];
        return sessionDate === date;
    });

    if (existingSession) {
        console.log(`Session already exists for user ${userId}, type ${callType}, date ${date}`);
        return; // Skip - already scheduled
    }

    // Calculate scheduled datetime
    const [hour, minute] = time.split(":").map(Number);
    const scheduledDate = new Date(`${date}T${time.padStart(5, "0")}:00Z`);

    // Only schedule if time is in future (within next hour)
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    if (scheduledDate <= oneHourFromNow) {
        // Create call session
        await ctx.db.insert("callSessions", {
            userId,
            callType,
            scheduledFor: scheduledDate.toISOString(),
            status: "scheduled",
            attemptsCount: 0,
        });

        console.log(`Scheduled ${callType} for user ${userId} at ${scheduledDate.toISOString()}`);
    }
}