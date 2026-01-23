# PRD: Feedback & Support System

## 1. Executive Summary
Establish a lightweight mechanism for users to provide feedback on their coaching sessions and report technical issues. This is vital for the "Beta" phase to iterate on AI prompt quality and app usability.

## 2. Problem Statement
Without a structured feedback loop, we cannot distinguish between "bad AI advice," "technical call lag," or "UI bugs." Users need a low-friction way to communicate their experience.

## 3. Goals & Success Metrics
- **Goal**: Capture user sentiment after calls.
- **Metric**: > 30% of calls have a simple rating/feedback.
- **Goal**: Centralized bug reporting.
- **Metric**: Zero lost bug reports in the first month.

## 4. Functional Requirements
- **REQ-001: Post-Call Rating**: A simple 1-5 star or Thumbs Up/Down on the summary page.
- **REQ-002: Text Feedback**: Optional text area for users to explain *why* a call was good or bad.
- **REQ-003: "Report a Bug" Button**: Persistent button in the navigation or settings.
- **REQ-004: Admin Dashboard View**: Basic Convex query to view all feedback in the internal tool/debug page.

## 5. Technical Considerations
- **Schema**: Add a `feedback` table in `convex/schema.ts` linked to `callSessions`.
- **Integration**: Consider a simple webhook to Slack or Discord for real-time notification of negative feedback.

## 6. Implementation Roadmap
1. Add feedback table to schema.
2. Implement rating UI on the Summary page.
3. Create a simple "Support" modal.
4. Set up internal notifications for critical issues.
