
## Recap
- Remember that this was an old React Native mobile app that you transformed into a React webapp.
- Our goal is to have exactly the same logic as the old RN app, except for the "Import from old app" functionality, which was removed.
- In the Git history you can find the original RN code (commit d06c1ed109c400087b408e28816a603adfb4d2f8 is the complete original code).

## Constraints
- README.md is just for me for now, you should NOT read it and you must NOT change it.
- DOC.md is a file that you wrote to quickly recover context and you must always keep it up to date.
- Work only in this repository and only on the current branch.
- Do NOT introduce extra libraries unless you justify them briefly and they clearly reduce work or risk.
- Just use plain React with Typescript and CSS; no frameworks like Vite or NextJS.
- Keep the code style consistent (spacing, new lines, etc.).
- Testing: add/keep a minimal but meaningful test setup (unit for key logic + at least 1-2 smoke tests for critical flows). All tests must pass before closing a feature or fix.
- You MUST commit the code when you complete any task I give you. All commits must start with "Codex: ". All ignored files should be left alone, do not remove gitignore patterns.

## Dev environment
1. Install dependencies:
```bash
npm install
```

2. Start dev server:
```bash
npm start
```
The app runs on `http://localhost:5173`.

3. Build production bundle:
```bash
npm run build
```

4. Quality checks:
```bash
npm run lint
npm run typecheck
npm test
```







