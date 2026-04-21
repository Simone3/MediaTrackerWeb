
## Recap
- This is the back-end part of the Media Tracker application. In `../front-end` we have the web application UI. Both front-end and back-end are in the same Git repository, but each has its own self-consistent project.

## Core Constraints
- Work only in this repository and only on the current branch.
- Unless specifically asked to, you should only work on the front-end application when prompted in this root directory.
- `README.md` just contains minimal information about the application and how to run it.
- `DOCUMENTATION.md` contains the detailed application documentation.
- Keep `AGENTS.md` and `DOCUMENTATION.md` aligned and up to date. If either becomes stale or contradicts the project state, fix it as part of the task.
- Do NOT introduce extra libraries unless you justify them briefly and they clearly reduce work or risk.
- `package.json` dependencies must always use exact versions; do not use modifiers such as `^` or `~`.
- Prefer existing project patterns over new abstractions when they are available. However, do centralize behavior into shared components/utilities whenever convenient.
- "Media item" components must always stay generic and must not contain book-, movie-, TV show-, or videogame-specific logic or references. Delegate those to specific components that use or extend the generic "media item" components.
- Use plain Express with TypeScript only. Do not add other frameworks such as NestJS.
- Keep the code style consistent with the existing codebase, including spacing and newline conventions.

## Testing And Validation
- Testing should cover as much logic as possibile, both with unit tests and integration tests.
- All relevant checks must pass before closing a feature or fix:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`

## Delivery Rules
- You MUST commit the code when you complete any task.
- Every commit message must start with `Codex: `.
- Leave ignored files and `.gitignore` patterns alone.
