
Just a Codex experiment for now.

TODO:

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

- re-review logic code starting from screens and moving down (especially for media item parts)

- fully test on chrome/firefox (production build)
- fully test on mobile (need to deploy first?)

- "merge" web and be to deploy them as a single app? first, upgrade back-end dependencies
- limit signups in prod firebase? are there login attempts limits?

- rewrite agents
  - tell it to keep generic media item files clean from media-specific stuff
  - formatting advice
  - do not commit
  - make it generate agents instructions based on the current doc file!
  - make it summarize my code style
  - no carets etc. in package.json
- rewrite doc -> make it rewrite a true documentation
- rewrite readme
















