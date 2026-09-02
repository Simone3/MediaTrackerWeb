import { Config } from 'app/config/type-config';

/**
 * Configuration for automatic testing (unit and integration)
 */
export const testConfig: Config = {
	server: {
		port: 3123
	},
	db: {
		url: 'mongodb://127.0.0.1:27017/mediaTrackerBackEndTestDatabase'
	},
	externalApis: {
		timeoutMilliseconds: 5000,
		userAgent: '',
		theMovieDb: {
			basePath: 'http://mock-movie-api',
			movies: {
				imageBasePath: 'http://movie-images',
				search: {
					relativePath: '/search/movie',
					queryParams: {
						api_key: 'mock-api-key',
						query: ''
					}
				},
				details: {
					relativePath: '/movie/:movieId',
					queryParams: {
						api_key: 'mock-api-key',
						append_to_response: 'credits'
					}
				},
				directorJobName: 'Director'
			},
			tvShows: {
				imageBasePath: 'http://tv-images',
				search: {
					relativePath: '/search/tv',
					queryParams: {
						api_key: 'mock-api-key',
						query: ''
					}
				},
				details: {
					relativePath: '/tv/:tvShowId',
					queryParams: {
						api_key: 'mock-api-key'
					}
				},
				season: {
					relativePath: '/tv/:tvShowId/season/:seasonNumber',
					queryParams: {
						api_key: 'mock-api-key'
					}
				}
			}
		},
		googleBooks: {
			basePath: 'http://mock-book-api',
			search: {
				relativePath: '/volumes',
				queryParams: {
					key: 'mock-api-key',
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
					key: 'mock-api-key'
				}
			}
		},
		igdb: {
			basePath: 'http://mock-videogame-api',
			auth: {
				basePath: 'http://mock-twitch-auth',
				relativePath: '/oauth2/token',
				clientId: 'mock-client-id',
				clientSecret: 'mock-client-secret',
				grantType: 'client_credentials'
			},
			imageBasePath: 'http://videogame-images',
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
		level: 'off',
		file: './test/build-test/log/media-tracker.log',
		fileBackups: 14,
		apisInputOutput: {
			active: true,
			excludeRequestBodyRegExp: [],
			excludeResponseBodyRegExp: []
		},
		externalApisInputOutput: {
			active: true
		},
		databaseQueries: {
			active: true
		}
	},
	firebase: {
		databaseUrl: 'mocked',
		serviceAccountKey: {
			mocked: 'mocked'
		}
	}
};
