
Just a Codex experiment for now.

TODO:
- final manual code check -> from /presentational
  - search media references, no switch/ifs etc. (see e.g. getCreatorNames)
  - manual check again all form components
  - refactor into generic text input, date picker, etc. - authinput, authlink, authsubmit generalizable?
  - find unused properties
  - migrate to an eslint.config.js file
  - app-dark-screen-active added and removed?
  - remove blank lines after classes
  - CATEGORIES_MOBILE_BREAKPOINT rename and move
  - remove all multi-line imports
- fully test on chrome/firefox (production build)
- fully test on mobile (need to deploy first?)
- check dev vs. prod configs
  - how to inject them in a webapp?
  - do we need .env file?
  - edit package.json commands to set environment
  - restore config-sample.ts
  - Firebase API key is public?
  - is it useless to gitignore the configs?
- "merge" web and be to deploy them as a single app? first, upgrade back-end dependencies
- limit signups in prod firebase? are there login attempts limits?



















