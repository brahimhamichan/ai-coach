# PRD: Notifications & Messaging

## End State
- [ ] WhatsApp/SMS integration configured (Twilio/Resend/Vapi)
- [ ] Users can receive "Time to Call" reminders
- [ ] Users can receive daily summaries via text
- [ ] Preference toggles (SMS vs WhatsApp) respected

## Tasks

### Backend: Provider Integration [backend]
Set up integration with Twilio/WhatsApp provider.

**Verification:**
- `convex/messaging.ts` (or similar)
- Action `sendSMS` / `sendWhatsApp`
- Environment variables configured (TWILIO_SID, etc.)

### Backend: Notification Triggers [backend]
Logic to trigger notifications.

**Verification:**
- `convex/crons.ts` updated (or new cron) to check for notification times
- Sends reminder 5 mins before scheduled call
- Sends summary after "Review" call completed

### Frontend: Preferences UI [frontend]
Allow users to toggle notifications.

**Verification:**
- `src/app/settings/page.tsx` (or notifications tab)
- Toggles for `kmsEnabled`, `whatsappEnabled`
- Input for WhatsApp number (if different from main phone)

## Context

### Key Files
- `convex/messaging.ts`
- `convex/crons.ts`
- `convex/schema.ts` (check `whatsappPhone`, `smsEnabled`)

### Non-Goals
- Two-way chat bot (this is primarily outbound notifications for now)
