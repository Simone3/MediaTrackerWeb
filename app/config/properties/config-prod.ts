import { Config } from 'app/config/type-config';

const config: Config = {
	backEnd: {
		defaultTimeoutMilliseconds: 10000,
		baseUrl: 'https://media-tracker-back-end.onrender.com',
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
			blue: '#3c82eb',
			red: '#f25a5a',
			green: '#74eb74',
			orange: '#ee9b52',
			yellow: '#f5e064',
			purple: '#e75fe7',
			cyan: '#4bead7',
			grey: '#6e6d66',
			lightGrey: '#cccccc',
			white: 'white',
			availableCategoryColors: [],
			availableOwnPlatformColors: []
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

config.ui.colors.availableCategoryColors = config.ui.colors.availableOwnPlatformColors = [
	config.ui.colors.blue,
	config.ui.colors.red,
	config.ui.colors.green,
	config.ui.colors.orange,
	config.ui.colors.yellow,
	config.ui.colors.purple,
	config.ui.colors.cyan,
	config.ui.colors.grey
];

/**
 * Configuration for production environment
 */
export const prodConfig: Config = config;
