import { UserInternal } from 'app/data/models/internal/user';

/**
 * Portion of the internal state with the global user information
 */
export type UserGlobalState = {

	/**
	 * The current user data
	 */
	readonly user?: UserInternal;

	/**
	 * The current status of the user
	 */
	readonly status: UserStatus;
};

/**
 * The initial value for the global user state
 */
export const userGlobalStateInitialValue: UserGlobalState = {
	status: 'REQUIRES_CHECK',
	user: undefined
};

/**
 * Utility to map the state for persistence
 * @returns the mapped state
 */
export const mapUserGlobalForPersistence = (): UserGlobalState => {
	return {
		...userGlobalStateInitialValue
	};
};

/**
 * Portion of the internal state with the user operations progress state
 */
export type UserOperationsState = {
	
	/**
	 * The current status of the check login operation
	 */
	readonly checkLoginStatus: UserOperationStatus;
	
	/**
	 * The current status of the signup operation
	 */
	readonly signupStatus: UserOperationStatus;
	
	/**
	 * The current status of the login operation
	 */
	readonly loginStatus: UserOperationStatus;
	
	/**
	 * The current status of the logout operation
	 */
	readonly logoutStatus: UserOperationStatus;
};

/**
 * The initial value for the user operations state
 */
export const userOperationsStateInitialValue: UserOperationsState = {
	checkLoginStatus: 'IDLE',
	signupStatus: 'IDLE',
	loginStatus: 'IDLE',
	logoutStatus: 'IDLE'
};

/**
 * Utility to map the state for persistence
 * @returns the mapped state
 */
export const mapUserOperationsForPersistence = (): UserOperationsState => {
	return {
		...userOperationsStateInitialValue
	};
};

/**
 * The current status of the user
 */
export type UserStatus = 'REQUIRES_CHECK' | 'UNAUTHENTICATED' | 'AUTHENTICATED';

/**
 * The current status of a user operation
 */
export type UserOperationStatus = 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';
