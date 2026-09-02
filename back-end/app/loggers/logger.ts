import { config } from 'app/config/config';
import { AppError } from 'app/data/models/error/error';
import { logRedactor } from 'app/loggers/log-redactor';
import { requestScopeContext } from 'app/utilities/request-scope-context';
import { configure, getLogger, Logger, PatternLayout, shutdown } from 'log4js';

/**
 * Pattern layout for log4js
 */
const layout: PatternLayout = {
	type: 'pattern',
	pattern: '[%d] [%x{currentUserId}] [%x{correlationId}] %p - %m',
	tokens: {
		correlationId: () => {
			return requestScopeContext.correlationId || 'NONE';
		},
		currentUserId: () => {
			return requestScopeContext.currentUserId || 'NONE';
		}
	}
};

/**
 * Number of rolled log files to keep besides the current one. log4js defaults it to 1, i.e. yesterday would be the
 * oldest log available: this must be set explicitly to keep any history worth reading
 */
const LOG_FILE_BACKUPS = 14;

// Global log4js configuration
if(config.log.file) {
	configure({
		appenders: {
			file: {
				type: 'dateFile',
				filename: config.log.file,
				layout: layout,
				keepFileExt: true,
				compress: true,
				numBackups: LOG_FILE_BACKUPS
			},
			console: {
				type: 'console',
				layout: layout
			}
		},
		categories: {
			default: {
				appenders: [ 'file', 'console' ],
				level: config.log.level
			}
		}
	});
}
else {
	configure({
		appenders: {
			console: {
				type: 'console',
				layout: layout
			}
		},
		categories: {
			default: {
				appenders: [ 'console' ],
				level: config.log.level
			}
		}
	});
}

/**
 * Application logger. There is a single one for the whole application: what a log line is about is already written in
 * the line itself, and how much of it gets written is decided by the config.log switches at the call sites
 */
class MediaTrackerLogger {
	private log4js: Logger = getLogger();

	/**
	 * Writes a debug message if debug is enabled
	 * @param message the log message, with optional %s placeholders
	 * @param args the optional arguments for the placeholders
	 */
	public debug(message: string, ...args: unknown[]): void {
		if(this.log4js.isDebugEnabled()) {
			this.log4js.debug(message, ...this.stringify(args));
		}
	}
	
	/**
	 * Writes an info message if info is enabled
	 * @param message the log message, with optional %s placeholders
	 * @param args the optional arguments for the placeholders
	 */
	public info(message: string, ...args: unknown[]): void {
		if(this.log4js.isInfoEnabled()) {
			this.log4js.info(message, ...this.stringify(args));
		}
	}

	/**
	 * Writes a warning message if warning is enabled
	 * @param message the log message, with optional %s placeholders
	 * @param args the optional arguments for the placeholders
	 */
	public warn(message: string, ...args: unknown[]): void {
		if(this.log4js.isWarnEnabled()) {
			this.log4js.warn(message, ...this.stringify(args));
		}
	}

	/**
	 * Writes an error message if error is enabled
	 * @param message the log message, with optional %s placeholders
	 * @param args the optional arguments for the placeholders
	 */
	public error(message: string, ...args: unknown[]): void {
		if(this.log4js.isErrorEnabled()) {
			this.log4js.error(message, ...this.stringify(args));
		}
	}

	/**
	 * Internal helper to write the placeholder arguments as single-line strings
	 * @param args the arguments for the placeholders
	 * @returns the resulting array of string values
	 */
	private stringify(args: unknown[]): string[] {
		return args.map((arg) => {
			const stringValue = arg instanceof Error ? this.stringifyError(arg) : logRedactor.processAndStringify(arg);
			return stringValue.replace(/\r?\n|\r|\t/g, ' ');
		});
	}

	/**
	 * Internal helper to write an error as a string: JSON stringification is useless here, because the interesting
	 * parts of an Error (its message and its stack) are not enumerable properties and would produce an empty object
	 * @param error the error to write
	 * @returns the resulting string value
	 */
	private stringifyError(error: Error): string {
		if(error instanceof AppError) {
			// An AppError carries its cause chain in its details, which is more useful than its own stack: flatten it into the same line
			let result = `${error.errorCode} - ${error.errorDescription}`;
			let cause = error.errorDetails;

			while(cause !== undefined) {
				if(cause instanceof AppError) {
					result += ` <- ${cause.errorCode} - ${cause.errorDescription}`;
					cause = cause.errorDetails;
				}
				else {
					result += ` <- ${cause}`;
					cause = undefined;
				}
			}

			return result;
		}
		else {
			// A raw error has no cause chain and its stack is the only place the origin is written
			return error.stack ? error.stack : `${error.name}: ${error.message}`;
		}
	}
}

/**
 * Generic logger, used for all application logging
 */
export const logger = new MediaTrackerLogger();

/**
 * Callback to gracefully close the logger
 */
export const finalizeAndCloseLogger = (): void => {
	shutdown();
};
