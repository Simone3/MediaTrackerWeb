import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage } from 'app/controllers/core/common/local-storage';

/**
 * Implementation of the LocalStorage that uses AsyncStorage to access the device data
 * @see LocalStorage
 */
export class LocalStorageAsync implements LocalStorage {

	/**
	 * @override
	 */
	public async getValue(key: string): Promise<string | null> {

		return AsyncStorage.getItem(key);
	}

	/**
	 * @override
	 */
	public async setValue(key: string, value: string): Promise<void> {

		return AsyncStorage.setItem(key, value);
	}

	/**
	 * @override
	 */
	public async removeValue(key: string): Promise<void> {

		return AsyncStorage.removeItem(key);
	}
}
