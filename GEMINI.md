# ADHD Execution Coach - Gemini Context

## Project Overview

**ADHD Execution Coach** is a web application designed to help entrepreneurs with ADHD through scheduled AI phone calls (via Vapi) and a minimal dashboard. It emphasizes accountability and daily structure.

**Tech Stack:**
*   **Runtime:** Bun
*   **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS
*   **Backend/Database:** Convex
*   **Voice Integration:** Vapi
*   **Auth:** Convex Auth
*   **Testing:** Playwright

## Key Directories

*   `convex/`: Backend logic (schema, queries, mutations, actions).
*   `src/app/`: Next.js App Router pages and layouts.
*   `src/components/`: Reusable React components.
*   `src/lib/`: Utility functions.
*   `docs/`: Documentation and project rules.
*   `public/`: Static assets.

## Usage & Commands

### Setup
1.  **Install Dependencies:**
    ```bash
    bun install
    ```
2.  **Configure Convex:**
    ```bash
    npx convex dev
    ```
    (Follow prompts to log in and select project)

### Development
*   **Start Dev Server:**
    ```bash
    bun run dev
    ```
    (Runs both Next.js and Convex dev servers concurrently)
*   **Linting:**
    ```bash
    bun run lint
    ```

### Production
*   **Build:**
    ```bash
    bun run build
    ```
*   **Deploy Convex:**
    ```bash
    npx convex deploy --prod
    ```

## Development Conventions

### General
*   **Package Manager:** Use `bun` for all script executions.
*   **Type Safety:** Strict TypeScript usage.
*   **Formatting:** Prettier is used for formatting.

### Next.js & React
*   **Routing:** Use App Router structure (`src/app`).
*   **Components:**
    *   Use Functional Components with Hooks.
    *   File names: PascalCase for components (e.g., `Button.tsx`).
    *   Directory names: kebab-case (e.g., `components/auth-form`).
    *   Prefer Named Exports.
*   **Server vs. Client:**
    *   Default to React Server Components (RSC).
    *   Use `'use client'` only when interactivity is required.
    *   Minimize client-side state (`useState`, `useEffect`); prefer server fetching and URL state (`nuqs`).

### Backend (Convex)
*   **Schema:** defined in `convex/schema.ts`.
*   **Functions:**
    *   `query`: Read-only operations.
    *   `mutation`: Write operations.
    *   `action`: Third-party API interactions (e.g., Vapi).

### Styling
*   **Tailwind CSS:** Primary styling solution.
*   **Radix UI:** Used for accessible primitives (via `shadcn/ui` patterns).
