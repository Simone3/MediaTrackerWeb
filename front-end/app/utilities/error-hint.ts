/**
 * A short user-facing explanation of why an operation failed, to be appended to a generic error message
 */
export type ErrorHint = {
	/**
	 * The i18n key of the hint text
	 */
	key: string;

	/**
	 * The optional interpolation params of the hint text
	 */
	params?: {
		[key: string]: string;
	};
};

/**
 * Maps the Firebase Auth error codes to the corresponding hints
 */
const FIREBASE_AUTH_HINTS: { [errorCode: string]: string } = {
	'auth/email-already-in-use': 'error.flash.hints.firebaseEmailAlreadyInUse',
	'auth/invalid-email': 'error.flash.hints.firebaseInvalidEmail',
	'auth/missing-email': 'error.flash.hints.firebaseMissingEmail',
	'auth/missing-password': 'error.flash.hints.firebaseMissingPassword',
	'auth/weak-password': 'error.flash.hints.firebaseWeakPassword',
	'auth/password-does-not-meet-requirements': 'error.flash.hints.firebaseWeakPassword',
	'auth/invalid-credential': 'error.flash.hints.firebaseInvalidCredentials',
	'auth/wrong-password': 'error.flash.hints.firebaseInvalidCredentials',
	'auth/user-not-found': 'error.flash.hints.firebaseInvalidCredentials',
	'auth/user-disabled': 'error.flash.hints.firebaseUserDisabled',
	'auth/too-many-requests': 'error.flash.hints.firebaseTooManyRequests',
	'auth/network-request-failed': 'error.flash.hints.firebaseUnreachable',
	'auth/operation-not-allowed': 'error.flash.hints.firebaseOperationNotAllowed',
	'auth/requires-recent-login': 'error.flash.hints.firebaseRequiresRecentLogin',
	'auth/invalid-api-key': 'error.flash.hints.firebaseMisconfigured',
	'auth/configuration-not-found': 'error.flash.hints.firebaseMisconfigured'
};

/**
 * Maps the back-end error codes (see the back-end AppError constants) to the corresponding hints
 */
const BACK_END_HINTS: { [errorCode: string]: string } = {
	'generic.application': 'error.flash.hints.backEndGenericApplication',
	'generic.authentication': 'error.flash.hints.backEndAuthentication',
	'generic.authorization': 'error.flash.hints.backEndAuthorization',
	'api.not.found': 'error.flash.hints.backEndNotFound',
	'request.invalid': 'error.flash.hints.backEndInvalidRequest',
	'db.connection': 'error.flash.hints.backEndDatabaseConnection',
	'db.find': 'error.flash.hints.backEndDatabaseFind',
	'db.save': 'error.flash.hints.backEndDatabaseSave',
	'db.save.uniqueness': 'error.flash.hints.backEndDatabaseUniqueness',
	'db.delete': 'error.flash.hints.backEndDatabaseDelete',
	'db.delete.not.empty': 'error.flash.hints.backEndDatabaseNotEmpty',
	'external.api.invocation': 'error.flash.hints.backEndExternalApi',
	'external.api.generic': 'error.flash.hints.backEndExternalApi',
	'external.api.timeout': 'error.flash.hints.backEndExternalApiTimeout',
	'external.api.parsing': 'error.flash.hints.backEndExternalApiParse'
};

/**
 * Helper type for the fields this module reads from a Firebase error, structurally matched to avoid a dependency on the Firebase SDK
 */
type PossibleFirebaseError = {
	code?: unknown;
};

/**
 * Helper type for the fields this module reads from an Axios error, structurally matched to avoid a dependency on Axios
 */
type PossibleAxiosError = {
	isAxiosError?: unknown;
	code?: unknown;
	response?: {
		status?: unknown;
		data?: {
			errorCode?: unknown;
		};
	};
};

/**
 * Helper to extract a user-facing hint from a Firebase Auth error
 * @param error the source error
 * @returns the hint, if the error looks like a Firebase Auth error
 */
const getFirebaseErrorHint = (error: PossibleFirebaseError): ErrorHint | undefined => {
	const errorCode = error.code;
	if(typeof errorCode !== 'string' || !errorCode.startsWith('auth/')) {
		return undefined;
	}

	const mappedHint = FIREBASE_AUTH_HINTS[errorCode];
	if(mappedHint) {
		return {
			key: mappedHint
		};
	}

	// Unmapped Firebase codes are still worth showing: they are short and readable enough to point the user (or a bug report) in the right direction
	return {
		key: 'error.flash.hints.firebaseUnknown',
		params: {
			code: errorCode.substring('auth/'.length)
		}
	};
};

/**
 * Helper to extract a user-facing hint from a back-end invocation error
 * @param error the source error
 * @returns the hint, if the error looks like a back-end invocation error
 */
const getBackEndErrorHint = (error: PossibleAxiosError): ErrorHint | undefined => {
	if(!error.isAxiosError) {
		return undefined;
	}

	// The back end wraps every failure in an ErrorResponse payload: its error code is the most precise cause available
	const response = error.response;
	if(response) {
		const errorCode = response.data ? response.data.errorCode : undefined;
		if(typeof errorCode === 'string') {
			const mappedHint = BACK_END_HINTS[errorCode];
			if(mappedHint) {
				return {
					key: mappedHint
				};
			}
		}

		// Unknown (or missing) error code: the HTTP status is the only thing left to say
		if(typeof response.status === 'number') {
			return {
				key: 'error.flash.hints.backEndStatus',
				params: {
					status: String(response.status)
				}
			};
		}

		return undefined;
	}

	// No response at all means the request never made it to the server
	return {
		key: 'error.flash.hints.backEndUnreachable'
	};
};

/**
 * Helper to extract a short user-facing explanation from the raw error returned by Firebase or by the back end
 * @param error the raw error, of any shape
 * @returns the hint, if the error carries a recognizable cause
 */
export const getErrorHint = (error: unknown): ErrorHint | undefined => {
	if(!error || typeof error !== 'object') {
		return undefined;
	}

	return getFirebaseErrorHint(error) || getBackEndErrorHint(error);
};
