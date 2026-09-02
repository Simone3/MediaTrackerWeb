import { AppError } from 'app/data/models/error/error';
import { RequestHandler } from 'express-serve-static-core';

/**
 * Catch-all middleware to handle all undefined endpoints after every route has been checked
 * @param _ unused
 * @param __ unused
 * @param next the next callback
 */
export const catchAllMiddleware: RequestHandler = (_, __, next): void => {
	next(AppError.NOT_FOUND);
};
