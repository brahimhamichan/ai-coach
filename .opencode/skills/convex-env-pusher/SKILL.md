---
name: convex-env-pusher
description: Pushes environment variables from .env.local to the Convex backend.
---

# Convex Environment Variable Pusher

This skill allows you to synchronize your local environment variables with your Convex backend. It ignores local deployment configuration and only pushes application secrets and configuration.

## Usage

When you have added or updated environment variables in your `.env.local` file and need them to be available in your Convex backend (e.g., for Vapi, Resend, or other integrations), run the following command:

```bash
bun .agent/skills/convex-env-pusher/scripts/push-env-vars.ts
```

## How it Works

1.  Reads `.env.local`.
2.  Parses valid key-value pairs.
3.  Skips `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`.
4.  Executes `npx convex env set KEY=VALUE` for each variable.

## When to Use

- After adding new keys to `.env.local`.
- When updating API keys or secrets.
- If you encounter errors in Convex functions related to missing environment variables.
