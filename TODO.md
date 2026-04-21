
Just a Codex experiment for now.

TODO:

- "merge" web and be to deploy them as a single app
- then upgrade back-end dependencies
- also fix CORS configuration on BE!

------

in the future:
- platform/group/seasons pages disable media item form guard when clicking on the header icon (home link)
- mock user/pwd creates a mock state for local tests even in prod - create catalog mocks for all 4 media types with lord of the rings



-------------

Locally, the rule is now:
- npm start => uses dev
- npm run build => uses prod
- MEDIA_TRACKER_APP_ENV=prod npm start => runs the local dev server but with production app config
- MEDIA_TRACKER_APP_ENV=dev npm run build => builds a production bundle with dev app config, if you ever want that explicitly














