# PRD: Voice Integration (Vapi)

## End State
- [ ] Vapi webhooks processed correctly for call status updates
- [ ] Outbound calls can be triggered via API/Frontend
- [ ] Call transcripts and summaries stored in Convex
- [ ] Call sessions properly transition states (scheduled -> in_progress -> completed)

## Tasks

### Backend: Vapi Configuration [backend]
Set up Vapi client and authentication.

**Verification:**
- `convex/vapi.ts` (or relevant file) exports Vapi helper functions
- `convex/auth.config.ts` or env vars checked for `VAPI_PRIVATE_KEY`
- Vapi public key exposed to frontend if needed

### Backend: Webhook Handling [backend]
Implement webhook endpoint to receive updates from Vapi.

**Verification:**
- `http.ts` or `convex/http.ts` handles `POST /vapi-webhook`
- Validates Vapi signature (if applicable)
- Updates `calls` table with status (ringing, in-progress, completed)
- Updates `callSessions` status based on call outcome

### Backend: Outbound Call Trigger [backend]
Implement mutation to initiate a call.

**Verification:**
- `triggerOutboundCall` mutation in `convex/vapi.ts`
- Calls Vapi API to start phone call
- Creates `calls` record
- Returns `vapiCallId` to client

### Backend: Session Management [backend]
Ensure call sessions are tracked and updated.

**Verification:**
- `callSessions` table reflects `completed` status after successful call
- `callSummaries` table populated with transcript/summary from Vapi webhook payload

## Context

### Key Files
- `convex/vapi.ts`
- `convex/http.ts`
- `convex/callSessions.ts`
- `convex/schema.ts`

### Non-Goals
- Inbound call handling (focus is on outbound coaching calls)
