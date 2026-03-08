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
