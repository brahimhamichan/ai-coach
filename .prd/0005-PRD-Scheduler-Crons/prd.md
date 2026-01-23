# PRD: Scheduler & Crons

## End State
- [ ] `convex/crons.ts` configured and running
- [ ] Daily cron job generates `callSessions` based on `schedules`
- [ ] Logic accounts for timezones and "evening" vs "weekly" call types
- [ ] Call sessions are created in `scheduled` status

## Tasks

### Backend: Cron Configuration [convex]
Set up the Convex Cron framework.

**Verification:**
- `convex/crons.ts` exists
- Cron job `scheduleCalls` defined to run hourly (or every 10 mins)
- Cron is registered in `convex/convex.config.ts` (if applicable)

### Backend: Scheduling Logic [convex]
Implement the core logic to find users needing calls.

**Verification:**
- `convex/scheduler.ts` (or similar) implementation
- Query `schedules` table for all users
- Filter: Is `current_time` matching `user_preference_time`? (Account for timezone)
- Create `callSessions` record if match found and not already scheduled

### Backend: Idempotency & Safety [backend]
Ensure no duplicate calls are generated.

**Verification:**
- Check for existing `callSession` for the same date/type before creating
- Handle edge cases (e.g. user changes timezone mid-day)

## Context

### Key Files
- `convex/crons.ts`
- `convex/schedules.ts`
- `convex/callSessions.ts`

### Non-Goals
- Real-time instant scheduling (this is for recurring calls)
- Call execution (handled in Voice Integration PRD)
