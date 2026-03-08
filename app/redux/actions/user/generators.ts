import { UserInternal, UserSecretInternal } from 'app/data/models/internal/user';
import { CHECK_USER_LOGIN_STATUS, COMPLETE_CHECKING_USER_LOGIN_STATUS, COMPLETE_LOGGING_USER_IN, COMPLETE_LOGGING_USER_OUT, COMPLETE_SIGNING_USER_UP, FAIL_CHECKING_USER_LOGIN_STATUS, FAIL_LOGGING_USER_IN, FAIL_LOGGING_USER_OUT, FAIL_SIGNING_USER_UP, LOG_USER_IN, LOG_USER_OUT, SIGN_USER_UP, START_CHECKING_USER_LOGIN_STATUS, START_LOGGING_USER_IN, START_LOGGING_USER_OUT, START_SIGNING_USER_UP } from './const';
import { CheckUserLoginStatusAction, CompleteCheckingUserLoginStatusAction, CompleteLoggingUserInAction, CompleteLoggingUserOutAction, CompleteSigningUserUpAction, FailCheckingUserLoginStatusAction, FailLoggingUserInAction, FailLoggingUserOutAction, FailSigningUserUpAction, LogUserInAction, LogUserOutAction, SignUserUpAction, StartCheckingUserLoginStatusAction, StartLoggingUserInAction, StartLoggingUserOutAction, StartSigningUserUpAction } from './types';

/**
 * Generator for the check user login status action, which causes the start checking user login status action, the async operation and then the complete/fail checking user login status action
 * @returns the action
 */
export const checkUserLoginStatus = (): CheckUserLoginStatusAction => {
	
	return {
		type: CHECK_USER_LOGIN_STATUS
	};
};

/**
 * Generator for the start checking user login status action
 * @returns the action
 */
export const startCheckingUserLoginStatus = (): StartCheckingUserLoginStatusAction => {
	
	return {
		type: START_CHECKING_USER_LOGIN_STATUS
	};
};

/**
 * Generator for the complete checking user login status action
 * @param user the current user, if any
 * @returns the action
 */
export const completeCheckingUserLoginStatus = (user: UserInternal | undefined): CompleteCheckingUserLoginStatusAction => {
	
	return {
		type: COMPLETE_CHECKING_USER_LOGIN_STATUS,
		user: user
	};
};

/**
 * Generator for the fail checking user login status action
 * @returns the action
 */
export const failCheckingUserLoginStatus = (): FailCheckingUserLoginStatusAction => {
	
	return {
		type: FAIL_CHECKING_USER_LOGIN_STATUS
	};
};

/**
 * Generator for the sign user up action, which causes the start signing user up action, the async operation and then the complete/fail signing user up action
 * @param user the user data
 * @returns the action
 */
export const signUserUp = (user: UserSecretInternal): SignUserUpAction => {
	
	return {
		type: SIGN_USER_UP,
		user: user
	};
};

/**
 * Generator for the start signing user up action
 * @returns the action
 */
export const startSigningUserUp = (): StartSigningUserUpAction => {
	
	return {
		type: START_SIGNING_USER_UP
	};
};

/**
 * Generator for the complete signing user up action
 * @param user the current user
 * @returns the action
 */
export const completeSigningUserUp = (user: UserInternal): CompleteSigningUserUpAction => {
	
	return {
		type: COMPLETE_SIGNING_USER_UP,
		user: user
	};
};

/**
 * Generator for the fail signing user up action
 * @returns the action
 */
export const failSigningUserUp = (): FailSigningUserUpAction => {
	
	return {
		type: FAIL_SIGNING_USER_UP
	};
};

/**
 * Generator for the log user in action, which causes the start logging user in action, the async operation and then the complete/fail logging user in action
 * @param user the user data
 * @returns the action
 */
export const logUserIn = (user: UserSecretInternal): LogUserInAction => {
	
	return {
		type: LOG_USER_IN,
		user: user
	};
};

/**
 * Generator for the start logging user in action
 * @returns the action
 */
export const startLoggingUserIn = (): StartLoggingUserInAction => {
	
	return {
		type: START_LOGGING_USER_IN
	};
};

/**
 * Generator for the complete logging user in action
 * @param user the current user
 * @returns the action
 */
export const completeLoggingUserIn = (user: UserInternal): CompleteLoggingUserInAction => {
	
	return {
		type: COMPLETE_LOGGING_USER_IN,
		user: user
	};
};

/**
 * Generator for the fail logging user in action
 * @returns the action
 */
export const failLoggingUserIn = (): FailLoggingUserInAction => {
	
	return {
		type: FAIL_LOGGING_USER_IN
	};
};

/**
 * Generator for the log user out action, which causes the start logging user out action, the async operation and then the complete/fail logging user out action
 * @returns the action
 */
export const logUserOut = (): LogUserOutAction => {
	
	return {
		type: LOG_USER_OUT
	};
};

/**
 * Generator for the start logging user out action
 * @returns the action
 */
export const startLoggingUserOut = (): StartLoggingUserOutAction => {
	
	return {
		type: START_LOGGING_USER_OUT
	};
};

/**
 * Generator for the complete logging user out action
 * @returns the action
 */
export const completeLoggingUserOut = (): CompleteLoggingUserOutAction => {
	
	return {
		type: COMPLETE_LOGGING_USER_OUT
	};
};

/**
 * Generator for the fail logging user out action
 * @returns the action
 */
export const failLoggingUserOut = (): FailLoggingUserOutAction => {
	
	return {
		type: FAIL_LOGGING_USER_OUT
	};
};
