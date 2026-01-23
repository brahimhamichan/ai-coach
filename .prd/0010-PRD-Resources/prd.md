# PRD: Resources Library

## End State
- [ ] "Resources" page implemented
- [ ] Users can view coaching articles/guides
- [ ] Admin (or seeded data) management of resources

## Tasks

### Backend: Resources Schema [convex]
Table to store resource content.

**Verification:**
- `convex/schema.ts` updated with `resources` table (title, content, type, tags)
- Seed script or admin mutation to populate initial content

### Frontend: Resources UI [frontend]
Library view.

**Verification:**
- `src/app/resources/page.tsx`
- Grid/List of articles
- "Read" view for individual resource

## Context

### Key Files
- `convex/schema.ts`
- `src/app/resources/page.tsx`

### Non-Goals
- User-generated content (this is system provided)
