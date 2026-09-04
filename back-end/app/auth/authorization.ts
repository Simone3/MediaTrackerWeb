import { logger } from 'app/loggers/logger';
import { requestScopeContext } from 'app/utilities/request-scope-context';
import { requestParamUtils } from 'app/utilities/request-param-utils';
import { Request, RequestHandler, Response } from 'express-serve-static-core';

/**
 * Helper to send a 403 error. It answers directly instead of going through the error middleware because its response
 * body is not the standard error payload
 * @param request the request
 * @param response the response
 * @param error the error to log
 */
const onAuthorizationError = (request: Request, response: Response, error: unknown): void => {
	logger.warn('API %s %s - Rejected Request: Authorization error: %s', request.method, request.originalUrl, error);

	response
		.status(403)
		.send({ error: 'Forbidden' });
};

/**
 * Express middleware to check that the current user can access the requested user resources.
 * Must be used only for routes with the userId path param.
 * @param request the request
 * @param response the response
 * @param next the next callback
 */
export const userResourceAuthorizationMiddleware: RequestHandler = (request, response, next): void => {
	const userIdParam = requestParamUtils.getOptionalString(request.params.userId);
	const currentUserId = requestScopeContext.currentUserId;

	if(!userIdParam || !currentUserId) {
		onAuthorizationError(request, response, 'userResourceAuthorizationMiddleware not configured correctly');
		return;
	}

	// At the moment, a user can only access his/her own resources only
	if(userIdParam !== currentUserId) {
		onAuthorizationError(request, response, `Trying to access other user resources: requested is ${userIdParam} but current is ${currentUserId}`);
	}
	else {
		next();
	}
};
