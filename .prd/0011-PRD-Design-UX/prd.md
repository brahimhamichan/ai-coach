# PRD: Design & UX (ADHD-Friendly)

## End State
- [ ] Design System updated for high clarity and low cognitive load
- [ ] "Focus Mode" implemented for key workflows
- [ ] Micro-animations added for immediate positive feedback (gamification)
- [ ] Accessibility audit passed (WCAG AA)

## Tasks

### Design System Update [frontend]
Refine typography and colors for focus.

**Verification:**
- `tailwind.config.ts` updated with "Focus" color palette (calming blues/greens, high alert oranges)
- Typography scale adjusted for readability (Inter/Outfit fonts)
- Component library (Buttons, Cards) standardized for "Clickability" (affordance)

### Focus Mode Implementation [frontend]
Distraction-free layout for tasks.

**Verification:**
- `src/components/layout/FocusLayout.tsx` created
- Hides sidebar/navigation during deep work flows (e.g. Daily Plan, Weekly Review)
- Progress bars visible to show end-in-sight

### Gamification & Feedback [frontend]
Reward user actions.

**Verification:**
- Interaction sounds or visual confetti on "Task Complete"
- Smooth transitions between states (no jarring jumps)
- "Streak" counters visible but not pressure-inducing

### Test Suite [testing]
Ensure UX/UI logic doesn't break.

**Verification:**
- Component tests for Focus Layout
- E2E tests for completing a task and seeing feedback

## Context

### Key Files
- `tailwind.config.ts`
- `src/globals.css`
- `src/components/ui/*`

### Non-Goals
- Complete rebrand (Logo etc.)
- Dark mode only (must support light/dark properly)
