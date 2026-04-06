
Just a Codex experiment for now.

TODO:

- remove menu and just leave a settings icon with embedded credits?
- unused lang-en properties
- colors are spread around the app, both with # and rgb()

- fully test on chrome
- fully test on firefox
- fully test on mobile (emulator or fake)
- minimal tests with a production build

- "merge" web and be to deploy them as a single app?
- then upgrade back-end dependencies

- rewrite agents.md
  - tell it to keep generic media item files clean from media-specific stuff
  - formatting advice
  - do not commit
  - make it generate agents instructions based on the current doc file!
  - make it summarize my code style
  - no carets etc. in package.json
  - important to centralize when possible
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














