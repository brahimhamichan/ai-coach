# PRD: Daily & Weekly Workflows

## End State
- [ ] Users can manually create/edit Daily Plans (Morning/Evening)
- [ ] Users can manually create/edit Weekly Objectives (Sunday)
- [ ] UI reflects "Current Status" (e.g. "Morning Review Pending", "Evening Plan Pending")
- [ ] Reflection flow (Wins/Misses/Blockers) fully implemented in UI

## Tasks

### Backend: Workflow State Logic [backend]
Implement queries to determine what the user should be doing *right now*.

**Verification:**
- `convex/workflow.ts` (new file)
- `getCurrentWorkflowState` query returning: "idle", "morning_review", "evening_plan", "weekly_review"
- Based on `schedules` and current time/completion status of today's plan

### Frontend: Daily Plan UI [frontend]
Interactive UI for creating/viewing daily plans.

**Verification:**
- `src/app/workflows/daily-plan/page.tsx`
- Form for 3 actions + start time
- "Review Yesterday" step if applicable
- Manual entry updates `dailyPlans` table

### Frontend: Weekly Review UI [frontend]
Interactive UI for Sunday review.

**Verification:**
- `src/app/workflows/weekly-review/page.tsx`
- Form for "Big Win", "Big Miss", "Bottleneck"
- Form for next week's generic objective
- Updates `weeklyObjectives` table

### Backend: Analysis Logic [backend]
(Optional for MVP) Simple extraction/analysis.

**Verification:**
- Mutations to "lock" a plan once the day has started (prevent editing?)
- Mutations to "complete" a weekly review

## Context

### Key Files
- `convex/dailyPlans.ts`, `convex/dailyReflections.ts` (if exist, else create)
- `convex/weeklyObjectives.ts`
- `src/app/workflows/*`

### Non-Goals
- AI generation of plans (this is manual override/interaction)
