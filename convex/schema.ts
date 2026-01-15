import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profile and preferences
  users: defineTable({
    phone: v.string(),
    timezone: v.string(),
    coachingTone: v.optional(v.string()), // default: "supportive"
    smsEnabled: v.boolean(),
    pushEnabled: v.boolean(),
  }),

  // Call scheduling configuration
  schedules: defineTable({
    userId: v.id("users"),
    onboardingTime: v.optional(v.string()), // ISO time, optional until onboarding done
    weeklyDay: v.string(), // default: "Sunday"
    weeklyTime: v.string(), // e.g., "10:00"
    eveningDays: v.array(v.string()), // default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    eveningTime: v.string(), // default: "17:00"
    includeSaturday: v.boolean(),
    includeSundayRecap: v.boolean(),
    retryIntervalMinutes: v.number(), // default: 30
  }).index("by_user", ["userId"]),

  // Vision profile from onboarding call
  visionProfiles: defineTable({
    userId: v.id("users"),
    visionSummary: v.string(),
    motivations: v.array(v.string()),
    costOfInaction: v.string(),
    commitmentDeclaration: v.string(),
    rawOnboardingNotes: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Weekly objectives from Sunday calls
  weeklyObjectives: defineTable({
    userId: v.id("users"),
    weekStartDate: v.string(), // ISO date of week start
    objective: v.string(),
    bottlenecks: v.array(v.string()), // exactly 3
    actions: v.array(v.string()), // exactly 3
    stopList: v.array(v.string()),
    startList: v.array(v.string()),
    continueList: v.array(v.string()),
  }).index("by_user_week", ["userId", "weekStartDate"]),

  // Daily action plans from evening calls
  dailyPlans: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date
    actions: v.array(v.object({
      text: v.string(),
      completed: v.optional(v.boolean()),
    })), // exactly 3
  }).index("by_user_date", ["userId", "date"]),

  // Call session tracking
  callSessions: defineTable({
    userId: v.id("users"),
    callType: v.union(
      v.literal("onboarding"),
      v.literal("weekly"),
      v.literal("evening")
    ),
    scheduledFor: v.string(), // ISO datetime
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("missed"),
      v.literal("failed")
    ),
    vapiCallId: v.optional(v.string()),
    attemptsCount: v.number(),
    lastAttemptAt: v.optional(v.string()),
    nextAttemptAt: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_type", ["userId", "callType"]),

  // Call summaries with extracted data
  callSummaries: defineTable({
    userId: v.id("users"),
    callSessionId: v.id("callSessions"),
    callType: v.union(
      v.literal("onboarding"),
      v.literal("weekly"),
      v.literal("evening")
    ),
    timestamp: v.string(), // ISO datetime
    summaryText: v.string(),
    extractedData: v.optional(v.any()), // JSON blob for vision/weekly/daily data
    userEditsText: v.optional(v.string()),
    locked: v.boolean(), // true after user saves edits
  }).index("by_user", ["userId"])
    .index("by_session", ["callSessionId"]),

  // Commitment logs for tracking
  commitmentLogs: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date
    type: v.union(v.literal("weekly"), v.literal("daily")),
    text: v.string(),
  }).index("by_user_date", ["userId", "date"]),
});
