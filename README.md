
Just a Codex experiment for now.

TODO:

- minimal tests on firefox
- minimal tests on mobile (emulator or fake)
- minimal tests with a React production build

- test locally with production config
- create a bundle to use locally on the Mac for now

- "merge" web and be to deploy them as a single app
- then upgrade back-end dependencies

- mock user/pwd creates a mock state for local tests even in prod - create catalog mocks for all 4 media types with lord of the rings

- rewrite agents.md
  - tell it to keep generic media item files clean from media-specific stuff
  - formatting advice
  - do not commit
  - make it generate agents instructions based on the current doc file!
  - make it summarize my code style
  - no carets etc. in package.json
  - important to centralize when possible
  - all displayed text must be in lang-en
  - all colors should be in css variables and prefer reuse for consistency
- rewrite doc.md
  - make it rewrite a true documentation
  - rename the file
- rewrite readme.md


-------------

Locally, the rule is now:
- npm start => uses dev
- npm run build => uses prod
- MEDIA_TRACKER_APP_ENV=prod npm start => runs the local dev server but with production app config
- MEDIA_TRACKER_APP_ENV=dev npm run build => builds a production bundle with dev app config, if you ever want that explicitly














