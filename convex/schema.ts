import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // User profile and preferences (Updated for daily-agent)
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    // App specific fields
    whatsappPhone: v.optional(v.string()),
    timezone: v.optional(v.string()), // Made optional for auth flow
    coachingTone: v.optional(v.string()), // default: "supportive"
    smsEnabled: v.optional(v.boolean()),  // Made optional for auth flow
    pushEnabled: v.optional(v.boolean()), // Made optional for auth flow
  }).index("email", ["email"])
    .index("by_phone", ["phone"]),

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
    commitmentLevel: v.optional(v.number()), // 1-10
  }).index("by_user_week", ["userId", "weekStartDate"]),

  // Daily action plans from evening calls
  // Daily action plans from evening calls (Planning Tomorrow)
  dailyPlans: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date
    actions: v.array(v.object({
      text: v.string(),
      why: v.optional(v.string()), // "Why does this matter?"
      completed: v.optional(v.boolean()),
    })), // exactly 3
    startTime: v.optional(v.string()), // "What time do you start action #1?"
  }).index("by_user_date", ["userId", "date"]),

  // Daily reflections from evening calls (Review Today)
  dailyReflections: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date of the day being reviewed
    wins: v.array(v.string()), // 1-3 wins
    misses: v.array(v.string()), // Top 1-3 misses
    blockers: v.string(), // Real blocker
    callSessionId: v.optional(v.id("callSessions")),
  }).index("by_user_date", ["userId", "date"]),

  // Generic agent data storage (Audit/Fallback)
  agentData: defineTable({
    callSessionId: v.optional(v.id("callSessions")),
    agentType: v.string(), // "onboarding", "weekly", "daily"
    data: v.any(),
    timestamp: v.string(),
  }).index("by_session", ["callSessionId"]),

  // Call session tracking
  callSessions: defineTable({
    userId: v.id("users"),
    callType: v.union(
      v.literal("onboarding-agent"),
      v.literal("weekly-agent"),
      v.literal("daily-agent"),
      v.literal("evening"),
      v.literal("daily")
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
    .index("by_user_type", ["userId", "callType"])
    .index("by_vapi_call_id", ["vapiCallId"]),

  // Call summaries with extracted data
  callSummaries: defineTable({
    userId: v.id("users"),
    callSessionId: v.id("callSessions"),
    callType: v.union(
      v.literal("onboarding-agent"),
      v.literal("weekly-agent"),
      v.literal("daily-agent"),
      v.literal("evening"),
      v.literal("daily")
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

  // Call history storage
  calls: defineTable({
    vapiCallId: v.string(),
    userId: v.id("users"), // To link to our user
    callSessionId: v.optional(v.id("callSessions")), // To link to the scheduled session
    status: v.string(), // "completed", "ringing", "in-progress", "ended-with-error"
    direction: v.string(), // "inbound", "outbound"
    startedAt: v.string(), // ISO timestamp
    endedAt: v.string(), // ISO timestamp
    durationSeconds: v.optional(v.number()),
    recordingUrl: v.optional(v.string()),
    transcription: v.optional(v.string()),
    summary: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_vapi_call_id", ["vapiCallId"])
    .index("by_session", ["callSessionId"]),
});
