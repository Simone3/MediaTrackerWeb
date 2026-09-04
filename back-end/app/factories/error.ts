import { ErrorResponse } from 'app/data/models/api/common';
import { AppError } from 'app/data/models/error/error';

/**
 * Helper factory to build an ErrorResponse object. A factory was chosen instead of a constructor to keep the model class
 * unaware of the internal error source.
 */
class ErrorResponseFactory {
	/**
	 * Builds an error response
	 * @param error the source data
	 * @returns the error response
	 */
	public from(error: AppError): ErrorResponse {
		const sourceError = error.sourceError;
		
		return {
			errorCode: sourceError.errorCode,
			errorDescription: sourceError.errorDescription,
			errorDetails: sourceError.errorDetails as string
		};
	}
}

/**
 * Singleton implementation of the ErrorResponseFactory
 */
export const errorResponseFactory = new ErrorResponseFactory();
