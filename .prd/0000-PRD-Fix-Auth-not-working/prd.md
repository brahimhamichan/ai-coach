# Emergency PRD: Authentication Fix

## 1. Executive Summary
Fix critical issues in the login and signup processes preventing users from accessing the application. Specifically, ensure that the user `brahim@scalingadventures.com` with password `brahim` can successfully sign up and log in.

## 2. Problem Statement
Users are reporting that the login and signup processes are not working as expected. Preliminary investigation suggests potential issues in the password-based authentication flow and the redirection logic after successful authentication. The current signup flow immediately signs the user out, which may be causing confusion or session issues.

## 3. Goals & Success Metrics
- **Goal**: Restore functional login and signup for password-based authentication.
- **Metric**: Successful login/signup for the test user `brahim@scalingadventures.com|brahim`.
- **Goal**: Correct redirection logic.
- **Metric**: Users are redirected to the dashboard (`/`) after login and appropriately after signup.

## 4. User Stories
- **As a user**, I want to be able to sign up with my email and password.
- **As a user**, I want to be able to log in with my registered credentials.
- **As a user**, I want to be automatically logged in after a successful signup.

## 5. Functional Requirements
- **REQ-001**: Fix `signIn("password", { flow: "signUp" })` logic in `SignupPage`. Remove immediate `signOut()`.
- **REQ-002**: Fix `signIn("password", { flow: "signIn" })` logic in `LoginPage`.
- **REQ-003**: Ensure password validation matches backend constraints (min 4 characters).
- **REQ-004**: Verify redirection logic using `router.push("/")`.

## 6. Implementation Plan
1. **Analyze**: Debug the current failure reason (check logs, verify environment variables).
2. **Fix Signup**: Remove unnecessary `signOut()` and ensure the user is redirected to the dashboard or login page correctly.
3. **Fix Login**: Ensure the `signIn` call correctly handles existing users.
4. **Test**: Verify with `brahim@scalingadventures.com|brahim`.

## 7. Technical Considerations
- Convex Auth `signIn` behavior for password provider.
- Next.js Router behavior and `router.refresh()`.

# Error Examples:
One of the error I'm getting:
'## Error Type
Console Error

## Error Message
[Request ID: 6612be0da80a92a6] Server Error
Uncaught TypeError: Cannot read properties of null (reading '_id')
    at authorize [as authorize] (../../node_modules/@convex-dev/auth/src/providers/Password.ts:120:15)
    at async handleCredentials (../../node_modules/@convex-dev/auth/src/server/implementation/signIn.ts:191:6)
    at async handler (../../node_modules/@convex-dev/auth/src/server/implementation/index.ts:416:26)



    at ConvexAuthNextjsClientProvider.useCallback[call] (file:///Users/brahimhamichan/Documents/DEV - Work/Web Apps/ai-coach/.next/dev/static/chunks/node_modules_86ecc484._.js:635:23)
    at async AuthProvider.useCallback[signIn] (file:///Users/brahimhamichan/Documents/DEV - Work/Web Apps/ai-coach/.next/dev/static/chunks/node_modules_86ecc484._.js:244:28)
    at async handleLoginSubmit (file:///Users/brahimhamichan/Documents/DEV - Work/Web Apps/ai-coach/.next/dev/static/chunks/_439f0432._.js:80:13)

Next.js version: 16.1.3 (Turbopack)"