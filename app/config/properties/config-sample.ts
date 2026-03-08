import { Config } from 'app/config/type-config';

const config: Config = {
	backEnd: {
		defaultTimeoutMilliseconds: 5000,
		baseUrl: '<backend_server_url>',
		bulkImport: {
			timeoutMilliseconds: 60000,
			defaultOwnPlatform: {
				name: 'Default',
				color: '#6e6d66',
				icon: 'default'
			}
		},
		assumeWellFormedResponse: true
	},
	ui: {
		colors: {
			colorPrimary: '#3F51B5',
			colorPrimaryDark: '#303F9F',
			colorAccent: '#408cff',
			colorContrastText: 'white',
			colorModalBackground: 'white',
			colorModalContent: 'black',
			colorModalButton: '#2CA69B',
			colorModalButtonDisabled: '#CDCDCD',
			colorFormInputs: 'black',
			colorDefaultIcon: 'black',
			separator: 'rgb(219,219,219)',
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
			black: 'black',
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
		mediaItems: false,
		import: false
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
 * Sample configuration that can be used as a template for other files, see config.ts
 */
export const sampleConfig: Config = config;
