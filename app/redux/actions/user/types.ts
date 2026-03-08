import { UserInternal, UserSecretInternal } from 'app/data/models/internal/user';
import { Action } from 'redux';

/**
 * The check user login status action
 */
export type CheckUserLoginStatusAction = Action & {
	
};

/**
 * The start checking user login status action
 */
export type StartCheckingUserLoginStatusAction = Action & {
	
};

/**
 * The complete checking user login status action
 */
export type CompleteCheckingUserLoginStatusAction = Action & {
	
	user: UserInternal | undefined;
};

/**
 * The fail checking user login status action
 */
export type FailCheckingUserLoginStatusAction = Action & {
	
};

/**
 * The sign user up action
 */
export type SignUserUpAction = Action & {
	
	user: UserSecretInternal;
};

/**
 * The start signing user up action
 */
export type StartSigningUserUpAction = Action & {
	
};

/**
 * The complete signing user up action
 */
export type CompleteSigningUserUpAction = Action & {

	user: UserInternal;
};

/**
 * The fail signing user up action
 */
export type FailSigningUserUpAction = Action & {
	
};

/**
 * The log user in action
 */
export type LogUserInAction = Action & {
	
	user: UserSecretInternal;
};

/**
 * The start logging user in action
 */
export type StartLoggingUserInAction = Action & {
	
};

/**
 * The complete logging user in action
 */
export type CompleteLoggingUserInAction = Action & {
	
	user: UserInternal;
};

/**
 * The fail logging user in action
 */
export type FailLoggingUserInAction = Action & {
	
};

/**
 * The log user out action
 */
export type LogUserOutAction = Action & {
	
};

/**
 * The start logging user out action
 */
export type StartLoggingUserOutAction = Action & {
	
};

/**
 * The complete logging user out action
 */
export type CompleteLoggingUserOutAction = Action & {
	
};

/**
 * The fail logging user out action
 */
export type FailLoggingUserOutAction = Action & {
	
};
