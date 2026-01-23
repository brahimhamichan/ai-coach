# PRD: History & Analytics

## End State
- [ ] "History" page implemented
- [ ] Users can browse past Daily Plans
- [ ] Users can browse past Weekly Objectives
- [ ] Visualization of completion rates (Consistency Score)

## Tasks

### Backend: History Queries [backend]
Efficiently fetch past data.

**Verification:**
- `convex/history.ts` (or reuse existing)
- `getPastPlans(month/year)` query
- `getCompletionStats` query (aggregated wins/misses)

### Frontend: History UI [frontend]
Calendar or list view of past activity.

**Verification:**
- `src/app/history/page.tsx`
- Calendar view showing green/red dots for days with/without completed plans
- Drill-down: Click day to see plan details
- Stats widget: "X% Consistency this month"

## Context

### Key Files
- `convex/dailyPlans.ts`
- `src/app/history/page.tsx`

### Non-Goals
- Artificial intelligence insights (e.g. "You tend to miss Mondays") - Basic stats only
