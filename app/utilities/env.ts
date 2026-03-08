/**
 * Reads environment values in both browser and Node-like runtimes.
 * @returns a key-value map of environment values
 */
const getRuntimeEnv = (): {[key: string]: string | undefined} => {
	// eslint-disable-next-line no-undef
	const runtime = globalThis as {
		process?: {
			env?: {[key: string]: string | undefined};
		};
		__MEDIA_TRACKER_ENV__?: {[key: string]: string | undefined};
	};

	if(runtime.process && runtime.process.env) {
		return runtime.process.env;
	}

	if(runtime.__MEDIA_TRACKER_ENV__) {
		return runtime.__MEDIA_TRACKER_ENV__;
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
