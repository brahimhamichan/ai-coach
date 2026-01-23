# PRD: Settings & Profile

## End State
- [ ] Users can update profile details (Name, Email)
- [ ] Phone number verification flow implemented
- [ ] Application settings (Timezone, Notification prefs) manageability
- [ ] Account deletion capability

## Tasks

### Backend: Profile Mutations [convex]
Mutations to update user table.

**Verification:**
- `updateUser` mutation enabled for name/image
- Validation logic for data integrity

### Backend: Phone Verification [convex]
Secure flow to verify phone numbers (SMS code).

**Verification:**
- `initiatePhoneVerification` mutation (Sends SMS via Twilio/Resend/Vapi?)
- `verifyPhoneCode` mutation
- `users.phone` updated only after verification
- `users.phoneVerified` flag set to true

### Frontend: Settings UI [frontend]
Settings page implementation.

**Verification:**
- `src/app/settings/page.tsx` exists and renders
- Profile form works
- Phone verification modal/UI works
- Timezone selector works

## Context

### Key Files
- `convex/users.ts`
- `src/app/settings/page.tsx`

### Non-Goals
- Payment method management (handled in Payments PRD)
