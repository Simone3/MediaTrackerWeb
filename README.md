
Just a Codex experiment for now.

TODO:

- fully test on chrome

  - bugs
    - edit media item field, then open open group or platform or show, then return -> media item data loss!
    - when editing a tv show group order missing does not disable save
    - genres field cannot write commas/spaces at end
    - manually editing completion date makes it disappear
    - save error disables browser back guard in forms
    - you can save seasons with watched > total

  - cosmetics
    - save loading gets displayed below the view (probably at the center of the page)
    - "1 seasons" in the field summary
    - font size in selects is smaller

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














