import type { FirebaseOptions } from 'firebase/app';

type FirebaseAuthConfig = Pick<FirebaseOptions, 'apiKey' | 'authDomain' | 'projectId' | 'appId'>;

/**
 * Type for configuration files
 */
export type Config = {
	backEnd: {
		defaultTimeoutMilliseconds: number;
		baseUrl: string;
		assumeWellFormedResponse: boolean;
	};
	firebase: FirebaseAuthConfig;
	ui: {
		colors: {
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
	};
	logging: {
		logInvocations: boolean;
		logMapping: boolean;
	};
};
