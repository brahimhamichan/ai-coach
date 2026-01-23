# PRD: Dashboard (Dash 2)

## End State
- [ ] Dashboard displays correct user data (Vision, Weekly, Daily)
- [ ] Users can edit Vision
- [ ] Users can add/manage Next Actions
- [ ] Users can trigger calls manually
- [ ] Next Session card shows accurate schedule info

## Tasks

### Backend: Dashboard Data Aggregation [backend]
Ensure `getDashboardData` returns all necessary fields efficiently.

**Verification:**
- `convex/dashboard.ts` exists and queries:
  - Vision Profile
  - Weekly Objective (latest)
  - Daily Plan (today/latest)
  - Next Session (scheduled)
- API endpoint `api.dashboard.getDashboardData` works

### Frontend: UI Implementation [frontend]
Finalize the `dash-2` page layout and interactivity.

**Verification:**
- `src/app/dash-2/page.tsx` renders without errors
- "Your Vision" card displays data and supports editing
- "This Week" card displays objective/actions
- "Next Actions" card allows adding and toggling completion
- "Next Session" card shows correct date/time

### Backend: Mutations [backend]
Enable data modification from the dashboard.

**Verification:**
- `updateVision` mutation works
- `addNextAction` mutation works and updates `dailyPlans`
- `toggleActionComplete` mutation works

### Interactive: Call Trigger [integration]
Allow users to trigger a call from the dashboard.

**Verification:**
- "Call Me" button calls `api.vapi.triggerOutboundCall`
- Handles errors (e.g. missing phone number) gracefully

## Context

### Key Files
- `src/app/dash-2/page.tsx`
- `convex/dashboard.ts`

### Non-Goals
- History page implementation (separate feature)
- Resources page implementation
