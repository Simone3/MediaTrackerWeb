import { authenticationMiddleware } from 'app/auth/authentication';
import { config } from 'app/config/config';
import { logCorrelationMiddleware, requestLoggerMiddleware, responseBodyCaptureMiddleware, responseLoggerMiddleware } from 'app/loggers/express-logger';
import { catchAllMiddleware } from 'app/routes/catch-all';
import { categoryRouter } from 'app/routes/category';
import { groupRouter } from 'app/routes/group';
import { bookCatalogRouter, bookEntityRouter } from 'app/routes/media-items/book';
import { movieCatalogRouter, movieEntityRouter } from 'app/routes/media-items/movie';
import { tvShowCatalogRouter, tvShowEntityRouter } from 'app/routes/media-items/tv-show';
import { videogameCatalogRouter, videogameEntityRouter } from 'app/routes/media-items/videogame';
import { miscRouter } from 'app/routes/misc';
import { ownPlatformRouter } from 'app/routes/own-platform';
import { requestScopeContextMiddleware } from 'app/utilities/request-scope-context';
import cors from 'cors';
import express from 'express';

// Base setup
const app = express();
app.use(express.json({
	limit: '10mb'
}));
app.use(requestScopeContextMiddleware);

// CORS
app.use(cors({
	credentials: true,
	origin: '*',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	preflightContinue: true
}));

// Logging, before the authentication so that a rejected request is logged too and carries its correlation ID
app.use(logCorrelationMiddleware);
if(config.log.apisInputOutput.active) {
	app.use(responseLoggerMiddleware);
	app.use(responseBodyCaptureMiddleware);
	app.use(requestLoggerMiddleware);
}

// Authentication
app.use(authenticationMiddleware);

// Misc routes
app.use('/', miscRouter);

// User, category and group routes
app.use('/', categoryRouter);
app.use('/', groupRouter);
app.use('/', ownPlatformRouter);

// Media item routes
app.use('/', movieEntityRouter);
app.use('/', movieCatalogRouter);
app.use('/', tvShowEntityRouter);
app.use('/', tvShowCatalogRouter);
app.use('/', bookEntityRouter);
app.use('/', bookCatalogRouter);
app.use('/', videogameEntityRouter);
app.use('/', videogameCatalogRouter);

// Final catch-all middleware
app.use(catchAllMiddleware);

/**
 * Main Express server instance, just requires a .listen() call
 */
export const server = app;
