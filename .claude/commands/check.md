---
description: Run lint, typecheck, and tests in a sub-project, then fix every failure
allowed-tools: Bash(npm run lint), Bash(npm run typecheck), Bash(npm test), Read, Edit, Glob, Grep
---

Run the full validation suite.

**Pick the sub-project first.** There is no root `package.json`; every command runs inside `front-end/` or `back-end/`.

- If `$ARGUMENTS` names one (`front-end`, `back-end`, `fe`, `be`), use it.
- Otherwise, use the sub-project the current session has been working in.
- If both have been touched, run the suite in both, one after the other.

In each selected sub-project:

```sh
npm run lint
npm run typecheck
npm test
```

Run all three even if an earlier one fails, so the full picture is visible in one pass.

Then fix every failure, respecting the conventions in that sub-project's `CLAUDE.md`. Re-run only the checks that failed until they pass. Do not weaken a test, disable an ESLint rule, or add a type assertion just to make a check pass — fix the underlying cause instead. If a failure looks pre-existing and unrelated to recent work, say so instead of silently fixing it.

`back-end` tests need a local MongoDB and the ability to bind the test server port. If `npm test` fails because the environment is missing rather than because the code is wrong, report that plainly and do not try to work around it.

Report a one-line pass/fail summary per check at the end, labelled by sub-project.
