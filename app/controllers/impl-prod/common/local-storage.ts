import { LocalStorage } from 'app/controllers/core/common/local-storage';
import { AppError } from 'app/data/models/internal/error';

/**
 * Implementation of the LocalStorage that uses browser localStorage
 * @see LocalStorage
 */
export class LocalStorageAsync implements LocalStorage {
	private getBrowserStorage(): Storage {
		if(typeof window === 'undefined' || !window.localStorage) {
			throw AppError.GENERIC.withDetails('Browser localStorage is not available in this environment');
		}
		return window.localStorage;
	}

	/**
	 * @override
	 */
	public async getValue(key: string): Promise<string | null> {
		return this.getBrowserStorage().getItem(key);
	}

	/**
	 * @override
	 */
	public async setValue(key: string, value: string): Promise<void> {
		this.getBrowserStorage().setItem(key, value);
	}

	/**
	 * @override
	 */
	public async removeValue(key: string): Promise<void> {
		this.getBrowserStorage().removeItem(key);
	}
}
