declare const __MEDIA_TRACKER_APP_ENV__: string | undefined;
declare const __MEDIA_TRACKER_BACK_END_BASE_URL__: string | undefined;

/**
 * Reads environment values in both browser and Node-like runtimes.
 * @returns a key-value map of environment values
 */
const getRuntimeEnv = (): { [key: string]: string | undefined } => {
	const runtime = globalThis as {
		process?: {
			env?: { [key: string]: string | undefined };
		};
		__MEDIA_TRACKER_ENV__?: { [key: string]: string | undefined };
	};

	if(runtime.__MEDIA_TRACKER_ENV__) {
		return runtime.__MEDIA_TRACKER_ENV__;
	}

	if(runtime.process && runtime.process.env) {
		return runtime.process.env;
	}

	if(typeof __MEDIA_TRACKER_APP_ENV__ !== 'undefined' || typeof __MEDIA_TRACKER_BACK_END_BASE_URL__ !== 'undefined') {
		return {
			MEDIA_TRACKER_APP_ENV: typeof __MEDIA_TRACKER_APP_ENV__ !== 'undefined' ? __MEDIA_TRACKER_APP_ENV__ : undefined,
			MEDIA_TRACKER_BACK_END_BASE_URL: typeof __MEDIA_TRACKER_BACK_END_BASE_URL__ !== 'undefined' ? __MEDIA_TRACKER_BACK_END_BASE_URL__ : undefined
		};
	}

	return {};
};

/**
 * Returns an environment value, if available
 * @param key the environment key
 * @returns the environment value
 */
export const getEnvValue = (key: string): string | undefined => {
	return getRuntimeEnv()[key];
};
