import { COMPLETE_CHECKING_USER_LOGIN_STATUS, COMPLETE_LOGGING_USER_IN, COMPLETE_LOGGING_USER_OUT, COMPLETE_SIGNING_USER_UP, FAIL_CHECKING_USER_LOGIN_STATUS, FAIL_LOGGING_USER_IN, FAIL_LOGGING_USER_OUT, FAIL_SIGNING_USER_UP, START_CHECKING_USER_LOGIN_STATUS, START_LOGGING_USER_IN, START_LOGGING_USER_OUT, START_SIGNING_USER_UP } from 'app/redux/actions/user/const';
import { UserOperationsState } from 'app/redux/state/user';
import { Action } from 'redux';

/**
 * The initial state for the user operations
 */
const initialState: UserOperationsState = {
	checkLoginStatus: 'IDLE',
	signupStatus: 'IDLE',
	loginStatus: 'IDLE',
	logoutStatus: 'IDLE'
};

/**
 * Reducer for the user operations portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const userOperations = (state: UserOperationsState = initialState, action: Action): UserOperationsState => {
	
	switch(action.type) {

		// When the app starts the check process, the operation status changes
		case START_CHECKING_USER_LOGIN_STATUS: {

			return {
				...state,
				checkLoginStatus: 'IN_PROGRESS'
			};
		}

		// When the app completes the check process, the operation status changes and all other operations are reset
		case COMPLETE_CHECKING_USER_LOGIN_STATUS: {

			return {
				...state,
				checkLoginStatus: 'COMPLETED',
				signupStatus: 'IDLE',
				loginStatus: 'IDLE',
				logoutStatus: 'IDLE'
			};
		}

		// When the app fails the check process, the operation status changes (an error is shown by the global handler)
		case FAIL_CHECKING_USER_LOGIN_STATUS: {

			return {
				...state,
				checkLoginStatus: 'IDLE'
			};
		}

		// When the app starts the signup process, the operation status changes
		case START_SIGNING_USER_UP: {

			return {
				...state,
				signupStatus: 'IN_PROGRESS'
			};
		}

		// When the app completes the signup process, the operation status changes and all other operations are reset
		case COMPLETE_SIGNING_USER_UP: {

			return {
				...state,
				checkLoginStatus: 'IDLE',
				signupStatus: 'COMPLETED',
				loginStatus: 'IDLE',
				logoutStatus: 'IDLE'
			};
		}

		// When the app fails the signup process, the operation status changes (an error is shown by the global handler)
		case FAIL_SIGNING_USER_UP: {

			return {
				...state,
				signupStatus: 'IDLE'
			};
		}

		// When the app starts the login process, the operation status changes
		case START_LOGGING_USER_IN: {

			return {
				...state,
				loginStatus: 'IN_PROGRESS'
			};
		}

		// When the app completes the login process, the operation status changes and all other operations are reset
		case COMPLETE_LOGGING_USER_IN: {

			return {
				...state,
				checkLoginStatus: 'IDLE',
				signupStatus: 'IDLE',
				loginStatus: 'COMPLETED',
				logoutStatus: 'IDLE'
			};
		}

		// When the app fails the login process, the operation status changes (an error is shown by the global handler)
		case FAIL_LOGGING_USER_IN: {

			return {
				...state,
				loginStatus: 'IDLE'
			};
		}

		// When the app starts the logout process, the operation status changes
		case START_LOGGING_USER_OUT: {

			return {
				...state,
				logoutStatus: 'IN_PROGRESS'
			};
		}

		// When the app completes the logout process, the operation status changes and all other operations are reset
		case COMPLETE_LOGGING_USER_OUT: {

			return {
				...state,
				checkLoginStatus: 'IDLE',
				signupStatus: 'IDLE',
				loginStatus: 'IDLE',
				logoutStatus: 'COMPLETED'
			};
		}

		// When the app fails the logout process, the operation status changes (an error is shown by the global handler)
		case FAIL_LOGGING_USER_OUT: {

			return {
				...state,
				logoutStatus: 'IDLE'
			};
		}
		
		default:
			return state;
	}
};
