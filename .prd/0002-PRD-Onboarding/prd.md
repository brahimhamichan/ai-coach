# PRD: User Onboarding Flow

## End State
- [ ] User completes onboarding form/flow
- [ ] Vision Profile created in Convex (`visionProfiles`)
- [ ] User preferences (tone, schedule) saved to `users` and `schedules`
- [ ] Onboarding status tracked

## Tasks

### Backend: Vision Profile Schema [convex]
Ensure `visionProfiles` and related user fields are correctly set up to store onboarding data.

**Verification:**
- `convex/schema.ts` has `visionProfiles` table (Verified: Exists)
- `users` table has `coachingTone`, `timezone`
- Mutation `createVisionProfile` exists in `convex/visionProfiles.ts` (or similar)
- Mutation `updateUserPreferences` exists

### Backend: Initial Schedule Setup [convex]
Create default schedule record for the user during onboarding.

**Verification:**
- Mutation `createSchedule` exists in `convex/schedules.ts`
- Sets default weekly/evening call times
- Links schedule to user

### Frontend: Onboarding Form UI [frontend]
Create a multi-step onboarding wizard.

**Verification:**
- `src/app/onboarding/page.tsx` exists (or similar route)
- Step 1: Basic Info (Name, Timezone)
- Step 2: Vision & Motivations (Input fields for vision summary, motivations)
- Step 3: Coaching Preferences (Tone, Call Times)
- Final Step: Submission and Redirect to Dashboard

### Backend: Completion Logic [backend]
Mark user as properly onboarded.

**Verification:**
- User record has flag/status indicating onboarding complete
- Redirect logic sends onboarded users to `/dashboard` instead of `/onboarding`

## Context

### Key Files
- `convex/schema.ts`: `visionProfiles`, `users`, `schedules`
- `convex/visionProfiles.ts` (Check if exists, if not create)
- `src/app/onboarding/page.tsx` (New)

### Non-Goals
- Voice calibration (handled in Voice Integration PRD)
- Payment setup
