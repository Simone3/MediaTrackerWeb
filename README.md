
Just a Codex experiment for now.

TODO:

- final manual code check -> from /presentational
  - refactor into generic text input, date picker, etc. - authinput, authlink, authsubmit generalizable?
  - find unused properties
  - app-dark-screen-active added and removed?
  - remove blank lines after classes (change agents.md too!)
  - CATEGORIES_MOBILE_BREAKPOINT rename and move
  - remove all multi-line imports
  - re-review logic code starting from screens and moving down (especially for media item parts)

- migrate to an eslint.config.js file
- fix linting on tests
- make it add more tests

- check dev vs. prod configs
  - how to inject them in a webapp?
  - do we need .env file?
  - edit package.json commands to set environment
  - restore config-sample.ts
  - Firebase API key is public?
  - is it useless to gitignore the configs?

- fully test on chrome/firefox (production build)
- fully test on mobile (need to deploy first?)

- "merge" web and be to deploy them as a single app? first, upgrade back-end dependencies
- limit signups in prod firebase? are there login attempts limits?

- rewrite agents
  - tell it to keep generic media item files clean from media-specific stuff
  - formatting advice
  - do not commit
  - make it generate agents instructions based on the current doc file!
- rewrite doc -> make it rewrite a true documentation
- rewrite readme
















