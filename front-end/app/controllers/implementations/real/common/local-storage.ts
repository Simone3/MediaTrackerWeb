import { LocalStorage } from 'app/controllers/interfaces/common/local-storage';
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
	public getValue(key: string): Promise<string | null> {
		return new Promise((resolve) => {
			resolve(this.getBrowserStorage().getItem(key));
		});
	}

	/**
	 * @override
	 */
	public setValue(key: string, value: string): Promise<void> {
		return new Promise((resolve) => {
			resolve(this.getBrowserStorage().setItem(key, value));
		});
	}

	/**
	 * @override
	 */
	public async removeValue(key: string): Promise<void> {
		return new Promise((resolve) => {
			resolve(this.getBrowserStorage().removeItem(key));
		});
	}
}
