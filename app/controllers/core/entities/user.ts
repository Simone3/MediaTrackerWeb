import { config } from 'app/config/config';
import { UserMockedController } from 'app/controllers/impl-mocks/entities/user';
import { UserFirebaseController } from 'app/controllers/impl-prod/entities/user';
import { UserInternal, UserSecretInternal } from 'app/data/models/internal/user';

/**
 * The data controller for the user entities
 */
export interface UserController {

	/**
	 * Gets the user (if any) currently saved locally on this device
	 * @returns the saved user or undefined, as a promise
	 */
	getCurrentUser(): Promise<UserInternal | undefined>;

	/**
	 * Gets the user current user authorization token. Throws an error if no user is currently logged in.
	 * @returns the auth token, as a promise
	 */
	getCurrentUserAccessToken(): Promise<string>;

	/**
	 * Signs a user up
	 * @param user the full user data
	 * @returns the user data, as a promise
	 */
	signup(user: UserSecretInternal): Promise<UserInternal>;
	
	/**
	 * Logs a user in
	 * @param user the full user data
	 * @returns the user data, as a promise
	 */
	login(user: UserSecretInternal): Promise<UserInternal>;

	/**
	 * Logs a user out
	 * @returns a void promise
	 */
	logout(): Promise<void>;
}

/**
 * Singleton implementation of the user controller
 */
export const userController: UserController = config.mocks.user ? new UserMockedController() : new UserFirebaseController();

