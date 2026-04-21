import { Config } from 'app/config/type-config';
import { availableEntityColors } from 'app/config/properties/shared-ui-colors';

const config: Config = {
	backEnd: {
		defaultTimeoutMilliseconds: 5000,
		baseUrl: 'http://localhost:3000',
		assumeWellFormedResponse: false
	},
	firebase: {
		apiKey: 'AIzaSyA2B7PugQ8ljmqBPZYWTlikUnImn2Zs0rs',
		authDomain: 'media-tracker-dev-db499.firebaseapp.com',
		projectId: 'media-tracker-dev-db499',
		appId: '1:59496103241:web:c4ce0cd45a57414b312e98'
	},
	ui: {
		colors: {
			availableCategoryColors: availableEntityColors.slice(),
			availableOwnPlatformColors: availableEntityColors.slice()
		},
		dateFormat: 'dd/MM/yyyy'
	},
	mocks: {
		user: false,
		categories: false,
		groups: false,
		ownPlatforms: false,
		mediaItems: false
	},
	external: {
		googleSearch: (term: string): string => {
			return `https://www.google.com/search?q=${term}`;
		},
		wikipediaSearch: (term: string): string => {
			return `https://en.wikipedia.org/wiki/Special:Search?search=${term}`;
		},
		justWatchSearch: (term: string): string => {
			return `https://www.justwatch.com/us/search?q=${term}`;
		},
		howLongToBeatSearch: (term: string): string => {
			return `https://howlongtobeat.com/?q=${term}#search1`;
		}
	},
	logging: {
		logInvocations: false,
		logMapping: false
	}
};

/**
 * Configuration for development environment
 */
export const devConfig: Config = config;
