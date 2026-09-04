/**
 * Util type for the keys map
 */
type RedactedMap = {
	[key: string]: boolean;
};

/**
 * Simple implementation of a log redactor
 */
class LogRedactor {
	/**
	 * Internal map of object keys to redact, in the lowercase alphanumeric form every key is normalized to
	 */
	private readonly REDACTED_OBJECT_KEYS: RedactedMap = {
		apikey: true,
		key: true,
		token: true,
		accesstoken: true,
		refreshtoken: true,
		authorization: true,
		password: true,
		secret: true,
		clientsecret: true
	};

	/**
	 * Takes a value and transforms it into a string, removing defined redacted values
	 * @param value the value of any type to transform
	 * @returns the resulting string
	 */
	public processAndStringify(value: unknown): string {
		if(value !== null && value !== undefined) {
			if(value instanceof Object) {
				if(value) {
					return JSON.stringify(value, (strigifyKey, strigifyValue) => {
						if(this.REDACTED_OBJECT_KEYS[this.normalizeKey(strigifyKey)]) {
							return '********';
						}
						else {
							return strigifyValue;
						}
					});
				}
			}
			else {
				return String(value);
			}
		}

		return '-';
	}

	/**
	 * Helper to reduce an object key to the form the redacted keys are written in, so that a single entry covers the
	 * casing and the separator a provider happens to use: api_key, apiKey and API-KEY are all the same key
	 * @param key the object key
	 * @returns the normalized key
	 */
	private normalizeKey(key: string): string {
		return key.toLowerCase().replace(/[^a-z0-9]/g, '');
	}
}

/**
 * Simple implementation of a log redactor
 */
export const logRedactor = new LogRedactor();
