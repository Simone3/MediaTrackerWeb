import { Config } from 'app/config/type-config';
import { availableEntityColors } from 'app/config/properties/shared-ui-colors';
import { getEnvValue } from 'app/utilities/env';

const defaultBackEndBaseUrl = 'https://media-tracker-back-end.onrender.com';

const config: Config = {
	backEnd: {
		defaultTimeoutMilliseconds: 10000,
		baseUrl: getEnvValue('MEDIA_TRACKER_BACK_END_BASE_URL') || defaultBackEndBaseUrl,
		assumeWellFormedResponse: true
	},
	firebase: {
		apiKey: 'AIzaSyB_lyrP8rAKjjvZ02Urzji8Y6c5N3ojV18',
		authDomain: 'media-tracker-da288.firebaseapp.com',
		projectId: 'media-tracker-da288',
		appId: '1:586847965574:web:81a2e13ac623c43ad15c07'
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
 * Configuration for production environment
 */
export const prodConfig: Config = config;
