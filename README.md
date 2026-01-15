# ADHD Execution Coach

A call-first ADHD execution coach for entrepreneurs. Powered by scheduled AI phone calls (Vapi), reinforced by SMS, anchored by a minimal dashboard.

## Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Convex
```bash
npx convex dev
```
Follow the prompts to log in and create a project.

### 3. Start Development Server
```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router)
- **Database**: Convex
- **Calls**: Vapi (integration ready)
- **SMS**: Plivo (planned)

## Environment Variables

See [env-template.md](env-template.md) for required variables.

## Project Structure

```
├── convex/           # Convex backend (schema, queries, mutations)
├── docs/templates/   # Vapi call prompts
├── src/
│   ├── app/          # Next.js pages
│   └── components/   # React components
└── env-template.md   # Environment setup guide
```

## Deployment

Deploy to Vercel for hosting, then deploy Convex to production:

```bash
npx convex deploy --prod
```

## Core Principles

- Calls are mandatory
- Avoidance is not allowed
- The day does not end without a recap call
