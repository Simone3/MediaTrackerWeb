import { LocalStorageAsync } from 'app/controllers/implementations/real/common/local-storage';
import { LocalStorage } from 'app/controllers/interfaces/common/local-storage';

/**
 * Singleton implementation of the local storage helper
 */
export const localStorage: LocalStorage = new LocalStorageAsync();
