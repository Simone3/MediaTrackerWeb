import { CLEAR_ERROR, SET_ERROR } from 'app/redux/actions/error/const';
import { ClearErrorAction, SetErrorAction } from 'app/redux/actions/error/types';

/**
 * Generator for the set error action, which sets the global error
 * @param error the generic error
 * @returns the action
 */
export const setError = (error: unknown): SetErrorAction => {
	
	return {
		type: SET_ERROR,
		error: error
	};
};

/**
 * Generator for the clear error action, which clears the global error
 * @returns the action
 */
export const clearError = (): ClearErrorAction => {
	
	return {
		type: CLEAR_ERROR
	};
};
