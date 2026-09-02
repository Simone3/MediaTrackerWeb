import { AppError } from 'app/data/models/error/error';
import { errorResponseFactory } from 'app/factories/error';
import { logger } from 'app/loggers/logger';
import { ErrorRequestHandler } from 'express-serve-static-core';

/**
 * The HTTP status of the errors that do not answer with the default one
 */
const ERROR_STATUS_CODES: { [errorCode: string]: number } = {
	[AppError.NOT_FOUND.errorCode]: 404
};

/**
 * The HTTP status of every other error
 */
const DEFAULT_ERROR_STATUS_CODE = 500;

/**
 * The errors the caller caused, which are logged as warnings: they say nothing about the health of the application
 */
const CLIENT_ERROR_CODES: string[] = [
	AppError.NOT_FOUND.errorCode,
	AppError.INVALID_REQUEST.errorCode,
	AppError.DATABASE_SAVE_UNIQUENESS.errorCode,
	AppError.DATABASE_DELETE_NOT_EMPTY.errorCode
];

/**
 * Final middleware to log a failed request and to turn its error into an API response. Every route delegates to it
 * with next(...), so that what an error logs and what it answers is decided in one place
 * @param error the error the route passed to next(), or anything a handler threw
 * @param request the Express request
 * @param response the Express response
 * @param next the next callback
 */
export const errorHandlerMiddleware: ErrorRequestHandler = (error, request, response, next): void => {
	// Nothing can be answered if the response is already on its way: let Express close the connection
	if(response.headersSent) {
		next(error);
		return;
	}

	const appError = error instanceof AppError ? error : AppError.GENERIC.withDetails(error);

	// The status and the log level follow the source error, the same one the response body reports: every route wraps
	// its failures in a generic label, so the outermost error never says what actually went wrong
	const sourceErrorCode = appError.sourceError.errorCode;
	const statusCode = ERROR_STATUS_CODES[sourceErrorCode] ? ERROR_STATUS_CODES[sourceErrorCode] : DEFAULT_ERROR_STATUS_CODE;

	if(CLIENT_ERROR_CODES.includes(sourceErrorCode)) {
		logger.warn('API %s %s - Rejected Request: %s', request.method, request.originalUrl, appError);
	}
	else {
		logger.error('API %s %s - Failed Request: %s', request.method, request.originalUrl, appError);
	}

	response.status(statusCode).json(errorResponseFactory.from(appError));
};
