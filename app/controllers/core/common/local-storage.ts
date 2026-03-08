import { LocalStorageAsync } from 'app/controllers/impl-prod/common/local-storage';

/**
 * Helper controller to access the local device storage
 */
export interface LocalStorage {

	/**
	 * Retrieves an entry by key
	 * @param key the entry key
	 * @returns the entry value or null if not found, as a promise
	 */
	getValue(key: string): Promise<string | null>;

	/**
	 * Saves an entry
	 * @param key the entry key
	 * @param value the entry value
	 * @returns a void promise
	 */
	setValue(key: string, value: string): Promise<void>;

	/**
	 * Removes an entry
	 * @param key the entry key
	 * @returns a void promise
	 */
	removeValue(key: string): Promise<void>;
}

/**
 * Singleton implementation of the JSON REST invoker
 */
export const localStorage = new LocalStorageAsync();
