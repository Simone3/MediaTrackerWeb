
# Media Tracker


## Description

Media Tracker is a web application that allows to keep track of books, movies, TV shows and videogames.

It's basically a todo-list with some extra features:
- Display several media item fields like name, description, release date, director/author, etc.
- Download media item data from catalogs (provided by Google Books, The Movie Database and Giant Bomb).
- Define custom "own platforms" to know where the media items are available (e.g. Netflix, Hulu, etc.).
- Define custom categories and groups to put media items together.
- Mark each media item as active, completed, owned or tracked to easily filter and search them.

The website is available at https://media-tracker-front-end.onrender.com/ but at the moment new signups are disabled.


## Technical Details

The repository contains both
- the `./front-end` application.
- the `./back-end` application.

Open the subfolders for more details.


## Installation

If you want to install your own version of the webapp:

- Download and install NodeJS 22.x and NPM from [here](https://nodejs.org/en/download/).
- Signup and request an API key from [Google Books](https://books.google.com).
- Signup and request an API key from [The Movie Database (TMDb)](https://www.themoviedb.org).
- Signup and request an API key from [Giant Bomb](http://www.giantbomb.com).
- Setup Firebase:
  - Create an account on [Firebase](https://firebase.google.com/).
  - Create a *dev* and/or a *prod* project for a web application.
  - For each project, activate the "Email/Password" sign-in method (Authentication -> Sign-in method).
- Clone this repository via Git.
- Define the back-end config properties:
  - Open `./back-end/app/config/config-sample.ts` to see a sample configuration file.
  - You can either define the environment variable `MEDIA_TRACKER_BE_CONFIG` containing a similar JSON as a string or create a `./back-end/app/config/MEDIA_TRACKER_BE_CONFIG.json` file directly containing the config JSON.
  - Either way, you can leave all properties as is except for:
    - `db.url` (URL to your MongoDB database).
    - Several properties with the external API keys (Google Books, TMDb, Giant Bomb) requested above, see `<your_api_key_here>`.
    - `firebase.databaseUrl` with the URL that can be copied from the corresponding Firebase project (Project settings -> Service accounts -> Firebase Admin SDK -> databaseURL).
    - `firebase.serviceAccountKey` with the JSON that can be downloaded from the corresponding Firebase project (Project settings -> Service accounts -> Firebase Admin SDK -> Generate new private key).
- Define the front-end config properties:
  - Edit `./front-end/app/config/properties/config-dev.ts` and/or `./front-end/app/config/properties/config-prod.ts` with your own URLs / Firebase configs / etc.


## Run locally

- Download, install and start MongoDB following [this guide](https://docs.mongodb.com/manual/administration/install-community/).
- Execute `npm install` in the `./back-end` project folder.
- Launch the `./back-end` project with `npm run build` and then `npm run start`.
- Execute `npm install` in the `./front-end` project folder.
- Launch the `./front-end` project with:
  - `npm start` to run locally with dev configs.
  - `npm run build` to build for production with prod configs.
  - `MEDIA_TRACKER_APP_ENV=prod npm start` to run locally with prod configs.
  - `MEDIA_TRACKER_APP_ENV=dev npm run build` to build for production with dev configs.


## Run on Render

- Edit `render.yaml`
- In the Render dashboard, click New -> Blueprint.
- Select the repo and the branch that contains `render.yaml`.
- When prompted for `MEDIA_TRACKER_BE_CONFIG`, paste the production JSON.
- Create the Blueprint and wait for both deploys to finish.




