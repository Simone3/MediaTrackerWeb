import { config } from 'app/config/config';
import { elapsedTime } from 'app/loggers/elapsed-time';
import { logger } from 'app/loggers/logger';
import { requestScopeContext } from 'app/utilities/request-scope-context';
import { stringUtils } from 'app/utilities/string-utils';
import mung from 'express-mung';
import { RequestHandler } from 'express-serve-static-core';
import { v4 as uuid4 } from 'uuid';

/**
 * Key of the response body kept in the Express response locals between the JSON hook and the response log line
 */
const RESPONSE_LOG_BODY = 'responseLogBody';

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
	const logUrl = req.originalUrl;
	const skipBodyRegExp = config.log.apisInputOutput.excludeRequestBodyRegExp;
	const logBody = skipBodyRegExp.length === 0 || !stringUtils.matches(logUrl, skipBodyRegExp) ? req.body : '{body-log-skipped}';
	logger.info('API %s %s - Received Request: %s', req.method, logUrl, logBody);

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
		const logUrl = req.originalUrl;
		const skipBodyRegExp = config.log.apisInputOutput.excludeResponseBodyRegExp;
		const responseBody = res.locals[RESPONSE_LOG_BODY];
		const logBody = skipBodyRegExp.length === 0 || !stringUtils.matches(logUrl, skipBodyRegExp) ? responseBody : '{body-log-skipped}';
		logger.info('API %s %s - Sent Response: %s in %s - %s', req.method, logUrl, res.statusCode, elapsedTime.since(startNs), logBody);
	});

	next();
};
