import { Config } from 'app/config/type-config';

/**
 * Sample configuration that can be used as a template for the MEDIA_TRACKER_BE_CONFIG environment variable (see config.ts)
 * It must be trasformed into a valid JSON.
 */
export const sampleConfig: Config = {
	server: {
		port: 3000
	},
	db: {
		url: 'mongodb://<your_db_host_here>/<your_db_name_here>'
	},
	externalApis: {
		timeoutMilliseconds: 5000,
		userAgent: '<your_user_agent>',
		theMovieDb: {
			basePath: 'http://api.themoviedb.org/3',
			movies: {
				imageBasePath: 'http://image.tmdb.org/t/p/w780',
				search: {
					relativePath: '/search/movie',
					queryParams: {
						api_key: '<your_api_key_here>',
						query: ''
					}
				},
				details: {
					relativePath: '/movie/:movieId',
					queryParams: {
						api_key: '<your_api_key_here>',
						append_to_response: 'credits'
					}
				},
				directorJobName: 'Director'
			},
			tvShows: {
				imageBasePath: 'http://image.tmdb.org/t/p/w780',
				search: {
					relativePath: '/search/tv',
					queryParams: {
						api_key: '<your_api_key_here>',
						query: ''
					}
				},
				details: {
					relativePath: '/tv/:tvShowId',
					queryParams: {
						api_key: '<your_api_key_here>'
					}
				},
				season: {
					relativePath: '/tv/:tvShowId/season/:seasonNumber',
					queryParams: {
						api_key: '<your_api_key_here>'
					}
				}
			}
		},
		googleBooks: {
			basePath: 'https://www.googleapis.com/books/v1',
			search: {
				relativePath: '/volumes',
				queryParams: {
					key: '<your_api_key_here>',
					langRestrict: 'en',
					country: 'US',
					orderBy: 'relevance',
					projection: 'lite',
					q: '',
					maxResults: '10'
				}
			},
			details: {
				relativePath: '/volumes/:bookId',
				queryParams: {
					key: '<your_api_key_here>'
				}
			}
		},
		igdb: {
			basePath: 'https://api.igdb.com/v4',
			auth: {
				basePath: 'https://id.twitch.tv',
				relativePath: '/oauth2/token',
				clientId: '<your_twitch_client_id_here>',
				clientSecret: '<your_twitch_client_secret_here>',
				grantType: 'client_credentials'
			},
			imageBasePath: 'https://images.igdb.com/igdb/image/upload',
			imageSize: 'logo_med_2x',
			imageExtension: 'jpg',
			search: {
				relativePath: '/games',
				limit: 10
			},
			details: {
				relativePath: '/games'
			}
		}
	},
	log: {
		level: 'debug',
		file: '<your_path_here>/media-tracker.log',
		apisInputOutput: {
			active: true,
			excludeRequestBodyRegExp: [ '^/users/[^/]+/import/old-app$' ],
			excludeResponseBodyRegExp: []
		},
		externalApisInputOutput: {
			active: true
		},
		databaseQueries: {
			active: true
		},
		performance: {
			active: true
		}
	},
	firebase: {
		databaseUrl: 'https://<your_project_here>.firebaseio.com',
		serviceAccountKey: {
			/* Your private key JSON (downloaded from Firebase console) contents here */
		}
	}
};
