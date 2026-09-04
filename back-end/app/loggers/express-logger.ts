import { config } from 'app/config/config';
import { elapsedTime } from 'app/loggers/elapsed-time';
import { HIDDEN_LOG_VALUE, logger } from 'app/loggers/logger';
import { STATUS_ROUTE_PATH } from 'app/routes/misc';
import { requestScopeContext } from 'app/utilities/request-scope-context';
import mung from 'express-mung';
import { Request, RequestHandler } from 'express-serve-static-core';
import { v4 as uuid4 } from 'uuid';

/**
 * Key of the response body kept in the Express response locals between the JSON hook and the response log line
 */
const RESPONSE_LOG_BODY = 'responseLogBody';

/**
 * Helper to pick the level of the request and response lines of a request: the CORS preflights and the status pings are
 * not part of the application API surface and say nothing about what the application is doing, so they are written at
 * debug, where they can still be turned on, instead of burying the lines that do say something
 * @param req the Express request
 * @returns the logger method to write the line with
 */
const getLogLine = (req: Request): (message: string, ...args: unknown[]) => void => {
	const isNonApiRequest = req.method === 'OPTIONS' || (req.method === 'GET' && req.path === STATUS_ROUTE_PATH);
	return isNonApiRequest ? logger.debug.bind(logger) : logger.info.bind(logger);
};

/**
 * Express middleware to set request-scoped context information
 * @param _ unused
 * @param __ unused
 * @param next the next callback
 */
export const logCorrelationMiddleware: RequestHandler = (_, __, next): void => {
	requestScopeContext.correlationId = uuid4();
	next();
};

/**
 * Express middleware to log API requests
 * @param req the Express request
 * @param _ unused
 * @param next the next callback
 */
export const requestLoggerMiddleware: RequestHandler = (req, _, next): void => {
	const logBody = config.log.apisInputOutput.includeBodies ? req.body : HIDDEN_LOG_VALUE;
	getLogLine(req)('API %s %s - Received Request: %s', req.method, req.originalUrl, logBody);

	next();
};

/**
 * Express middleware to keep the JSON response body for the response log: it cannot be read back from the response
 * once it has been sent, and the log line is only written when the response is complete
 */
export const responseBodyCaptureMiddleware: RequestHandler = mung.json((body, _, res) => {
	res.locals[RESPONSE_LOG_BODY] = body;
	return body;
}, {
	mungError: true
});

/**
 * Express middleware to log API responses, with the time the request took printed inline. It logs on the response
 * 'finish' event rather than in the JSON hook so that a response without a JSON body is logged too
 * @param req the Express request
 * @param res the Express response
 * @param next the next callback
 */
export const responseLoggerMiddleware: RequestHandler = (req, res, next): void => {
	const startNs = elapsedTime.start();

	res.on('finish', () => {
		const logBody = config.log.apisInputOutput.includeBodies ? res.locals[RESPONSE_LOG_BODY] : HIDDEN_LOG_VALUE;
		getLogLine(req)('API %s %s - Sent Response: %s in %s - %s', req.method, req.originalUrl, res.statusCode, elapsedTime.since(startNs), logBody);
	});

	next();
};
