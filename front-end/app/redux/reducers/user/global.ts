import { Action } from 'redux';
import { COMPLETE_CHECKING_USER_LOGIN_STATUS, COMPLETE_LOGGING_USER_IN, COMPLETE_SIGNING_USER_UP } from 'app/redux/actions/user/const';
import { CompleteCheckingUserLoginStatusAction, CompleteLoggingUserInAction, CompleteSigningUserUpAction } from 'app/redux/actions/user/types';
import { UserGlobalState, userGlobalStateInitialValue } from 'app/redux/state/user';

/**
 * Reducer for the global user portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const userGlobal = (state: UserGlobalState = userGlobalStateInitialValue, action: Action): UserGlobalState => {
	switch(action.type) {
		// When the user is retrived from local storage, the current user (may or may not be defined) is updated and the status changes
		case COMPLETE_CHECKING_USER_LOGIN_STATUS: {
			const completeCheckingUserLoginStatusAction = action as CompleteCheckingUserLoginStatusAction;
			const user = completeCheckingUserLoginStatusAction.user;

			return {
				user: user,
				status: user ? 'AUTHENTICATED' : 'UNAUTHENTICATED'
			};
		}

		// When the user authenticates, the current user is updated and the status changes
		case COMPLETE_SIGNING_USER_UP:
		case COMPLETE_LOGGING_USER_IN: {
			const authAction = action as CompleteSigningUserUpAction | CompleteLoggingUserInAction;

			return {
				user: authAction.user,
				status: 'AUTHENTICATED'
			};
		}

		default:
			return state;
	}
};
