
## Recap
- This is the back-end part of the Media Tracker application. In `../front-end` we have the web application UI. Both front-end and back-end are in the same Git repository, but each has its own self-consistent project.

## Core Constraints
- Work only in this repository and only on the current branch.
- Unless specifically asked to, you should only work on the back-end application when prompted in this root directory.
- `README.md` just contains minimal information about the application and how to run it.
- `DOCUMENTATION.md` contains the detailed application documentation.
- Keep `AGENTS.md` and `DOCUMENTATION.md` aligned and up to date. If either becomes stale or contradicts the project state, fix it as part of the task.
- Do NOT introduce extra libraries unless you justify them briefly and they clearly reduce work or risk.
- `package.json` dependencies must always use exact versions; do not use modifiers such as `^` or `~`.
- Prefer existing project patterns over new abstractions when they are available. However, do centralize behavior into shared utilities/helpers whenever convenient.
- Generic "media item" back-end modules must always stay generic and must not contain book-, movie-, TV show-, or videogame-specific logic or references. Delegate those to the specific movie, TV show, book, or videogame modules.
- Use plain Express with TypeScript only. Do not add other frameworks such as NestJS.
- Keep the code style consistent with the existing codebase, including spacing and newline conventions.

## Architecture And Design Rules
- Keep routes thin. Route files should validate requests, map API models to internal models, call controllers, and map results back to API responses. Business rules belong in controllers, not in routes.
- Use the existing layering consistently:
  - API boundary types in `app/data/models/api`
  - internal application types in `app/data/models/internal`
  - persistence shape in `app/schemas`
  - conversions in `app/data/mappers`
  - business logic in `app/controllers`
- Prefer `parserValidator` plus the existing API model classes for request validation instead of ad hoc validation in routes or controllers.
- Prefer `QueryHelper` for database access patterns instead of adding one-off Mongoose access styles in each controller.
- If behavior depends on category media type, prefer resolving the correct implementation through `mediaItemFactory` instead of duplicating `switch` statements across the codebase.
- Reuse the existing generic media-item infrastructure before adding new abstractions:
  - `app/routes/media-items/media-item.ts`
  - `app/controllers/entities/media-items/media-item.ts`
  - `app/data/models/api/media-items/media-item.ts`
  - `app/data/models/internal/media-items/media-item.ts`
  - `app/data/mappers/media-items/media-item.ts`
- External catalog integrations should go through the existing catalog controllers, external-service mappers, and `restJsonInvoker`.

## Behavioral Invariants
- There is no user collection in this back-end. Resource ownership is enforced through Firebase UID strings stored in documents and compared against the authenticated user.
- Authentication is globally enabled for the Express app. Only `OPTIONS` requests and `GET /status` are unauthenticated. Catalog routes are authenticated too, even though they are not `:userId`-scoped.
- A category's `mediaType` must not be changed if that category already contains media items.
- Deleting a category must continue to cascade to its groups, media items, and own platforms.
- Deleting a group must continue to delete the media items that belong to that group.
- Deleting an own platform must continue to unlink that platform from media items rather than deleting the media items themselves.
- Merging own platforms must continue to rewrite media-item references from the removed platforms to the kept platform.
- When code writes or transforms `completedOn`, it must also keep `completedLastOn` consistent.
- TV show seasons must remain positive, unique, and ordered by season number.

## Testing And Validation
- Testing should cover as much logic as possibile, both with unit tests and integration tests.
- All relevant checks must pass before closing a feature or fix:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
- `npm test` requires the local test environment expected by the project, including the MongoDB test database from `test/global/config-test.ts` and the ability to bind the local test server port.

## Delivery Rules
- You MUST commit the code when you complete any task.
- Every commit message must start with `Codex: `.
- Leave ignored files and `.gitignore` patterns alone.
