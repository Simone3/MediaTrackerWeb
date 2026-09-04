---
description: Reconcile a sub-project's docs/technical and CLAUDE.md with the actual state of the code
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(ls:*), Read, Edit, Glob, Grep
---

Check `docs/technical/` and `CLAUDE.md` against the current code and fix any drift.

**Pick the sub-project first.** If `$ARGUMENTS` names one (`front-end`, `back-end`, `fe`, `be`), scope the review to it; otherwise review the one the session has been working in, and both if both were touched. If `$ARGUMENTS` names a specific area instead, scope to that.

1. Read that sub-project's `docs/technical/README.md`, the sections the recent work touched, and its `CLAUDE.md`.
2. Compare against reality.

   Both sub-projects:
   - **§2 Repository map**: does every listed file still exist, and is every non-trivial source file listed?
   - **§3 Build and run**: does every documented `npm` script still exist in `package.json`?
   - **The index**: does it list every file in `docs/technical/`, and does every listed file exist?
   - **Cross-references**: does every `§N` link resolve, including the ones that cross into the other sub-project?

   `front-end` specifically:
   - **§5 Navigation**: does the route map match `app/utilities/navigation-routes.ts`, and the action table match `app/redux/sagas/navigation/navigation.ts`?
   - **§6 Redux state**: does the slice table match `app/redux/state/state.ts`, and the persistence rules match `app/redux/persistence.ts`?
   - **§9 Data layer**: do the documented endpoints match what the real controllers call, and the back end's §10?
   - **§14 Testing**: does the described coverage match what is in `tests/`?

   `back-end` specifically:
   - **§7 Domain model** and **§8 Persistence**: do the fields match `app/data/models/internal/**` and `app/schemas/**`?
   - **§9 Controllers**: do the cascade and merge behaviours match `app/controllers/entities/**`?
   - **§10 API surface**: does every documented route exist in `app/routes/**`, and every route appear in the docs?
   - **§16 Testing**: does the described coverage match what is in `test/`?

3. Fix what is stale. Prefer editing over appending — remove statements that are no longer true rather than layering caveats on them.
4. Keep the two documents non-overlapping: rules live in `CLAUDE.md`, detail lives in `docs/technical/`. A rule that has grown an explanation should have the explanation moved into the section that owns it.

Report what changed and what you verified as still accurate.
