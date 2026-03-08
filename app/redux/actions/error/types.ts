import { Action } from 'redux';

/**
 * The set error action
 */
export type SetErrorAction = Action & {

	error: unknown;
};

/**
 * The clear error action
 */
export type ClearErrorAction = Action & {

};
