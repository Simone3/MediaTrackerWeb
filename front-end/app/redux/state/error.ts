import { AppError } from 'app/data/models/internal/error';

/**
 * Portion of the state with the global error data
 */
export type ErrorState = {

	/**
	 * The error that occurred, if any.
	 * A string is displayed as is, an AppError gets displayed as its description.
	 */
	error?: AppError | string;
};

/**
 * The initial value for the error state
 */
export const errorStateInitialValue: ErrorState = {
	error: undefined
};

/**
 * Utility to map the state for persistence
 * @returns the mapped state
 */
export const mapErrorForPersistence = (): ErrorState => {
	return {
		...errorStateInitialValue
	};
};
