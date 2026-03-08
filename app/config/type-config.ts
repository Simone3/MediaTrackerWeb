import { OwnPlatform } from 'app/data/models/api/own-platform';

/**
 * Type for configuration files
 */
export type Config = {
	backEnd: {
		defaultTimeoutMilliseconds: number;
		baseUrl: string;
		bulkImport: {
			timeoutMilliseconds: number;
			defaultOwnPlatform: Required<OwnPlatform>;
		};
		assumeWellFormedResponse: boolean;
	};
	ui: {
		colors: {
			colorPrimary: string;
			colorPrimaryDark: string;
			colorAccent: string;
			colorContrastText: string;
			colorModalBackground: string;
			colorModalContent: string;
			colorModalButton: string;
			colorModalButtonDisabled: string;
			colorFormInputs: string;
			colorDefaultIcon: string;
			separator: string;
			blue: string;
			red: string;
			green: string;
			orange: string;
			yellow: string;
			purple: string;
			cyan: string;
			grey: string;
			lightGrey: string;
			white: string;
			black: string;
			availableCategoryColors: string[];
			availableOwnPlatformColors: string[];
		};
		dateFormat: string;
	};
	external: {
		googleSearch: (term: string) => string;
		wikipediaSearch: (term: string) => string;
		justWatchSearch: (term: string) => string;
		howLongToBeatSearch: (term: string) => string;
	};
	mocks: {
		user: boolean;
		categories: boolean;
		groups: boolean;
		ownPlatforms: boolean;
		mediaItems: boolean;
		import: boolean;
	};
	logging: {
		logInvocations: boolean;
		logMapping: boolean;
	};
}
