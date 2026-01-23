---
name: test-login
description: Automates the login process for the application using test credentials (brahim@scalingadventures.com / brahim123). Use this when you need to be authenticated to perform actions or tests in the application. It will automatically handle signup if the user does not exist.
---

# Test Login Skill

This skill automates the login or signup process for the application.

## Credentials

- **Email**: `brahim@scalingadventures.com`
- **Password**: `brahim123`

## Usage

To perform a login, use the provided Playwright script. This is especially useful for E2E testing or when you need a valid session to interact with the app.

### Automated Login

You can run the login script using Playwright:

```bash
npx playwright test .agent/skills/test-login/scripts/login.spec.ts
```

### Manual Steps (for Agent)

If you are interacting via the browser tool:

1. Navigate to `/login`.
2. Enter `brahim@scalingadventures.com` in the email field.
3. Click "Continue".
4. If prompted for a password, enter `brahim123` and click "Continue".
5. If you are redirected to `/signup`, enter both the email and password and click "Create account".
6. Verify you are redirected to `/chat`.

## Resources

- **Script**: [login.spec.ts](scripts/login.spec.ts)
