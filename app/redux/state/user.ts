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
}

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
}

/**
 * The current status of the user
 */
export type UserStatus = 'REQUIRES_CHECK' | 'UNAUTHENTICATED' | 'AUTHENTICATED';

/**
 * The current status of a user operation
 */
export type UserOperationStatus = 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';
