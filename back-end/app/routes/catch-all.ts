import { AppError } from 'app/data/models/error/error';
import { errorResponseFactory } from 'app/factories/error';
import { logger } from 'app/loggers/logger';
import { RequestHandler } from 'express-serve-static-core';

/**
 * Catch-all middleware to handle all undefined endpoints after every route has been checked
 * @param request the Express request
 * @param response the Express response
 */
export const catchAllMiddleware: RequestHandler = (request, response): void => {
	logger.info('Entered the final catch-all middleware for %s %s', request.method, request.originalUrl);
	response.status(404).json(errorResponseFactory.from(AppError.NOT_FOUND));
};
