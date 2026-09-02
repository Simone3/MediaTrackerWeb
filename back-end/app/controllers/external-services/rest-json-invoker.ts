import { config } from 'app/config/config';
import { AppError } from 'app/data/models/error/error';
import { elapsedTime } from 'app/loggers/elapsed-time';
import { logger } from 'app/loggers/logger';
import { ClassType, InvocationParams } from 'app/utilities/helper-types';
import { parserValidator } from 'app/utilities/parser-validator';
import axios, { AxiosError, AxiosRequestConfig, Cancel } from 'axios';

/**
 * Helper controller to invoke external JSON-based REST services
 */
export class RestJsonInvoker {
	private readonly TIMEOUT_CANCEL_MESSAGE = 'custom-timeout';

	/**
	 * Invokes a JSON-based service
	 * @param parameters the method parameters container
	 * @returns the 200 service response, as a promise
	 * @template TRequest the request class
	 * @template TResponse the response class
	 */
	public invoke<TRequest extends object | string | undefined, TResponse extends object>(parameters: InvocationParams<TRequest, TResponse>): Promise<TResponse> {
		const startNs = elapsedTime.start();

		return new Promise((resolve, reject): void => {
			// Build request options
			const cancelTokenSource = axios.CancelToken.source();
			const options: AxiosRequestConfig = {
				url: parameters.url,
				method: parameters.method,
				params: parameters.queryParams,
				data: this.getRequestBody(parameters.requestBody),
				cancelToken: cancelTokenSource.token,
				headers: {
					'Content-Type': parameters.requestContentType ? parameters.requestContentType : 'application/json',
					Accept: 'application/json',
					'Accept-Charset': 'utf-8',
					'User-Agent': config.externalApis.userAgent,
					...parameters.headers
				}
			};
			this.logRequest(options, parameters.hideRequestBodyInLogs);

			// Custom timeout handling (timeout field in options only handles connection timeout)
			const timeout = parameters.timeoutMilliseconds ? parameters.timeoutMilliseconds : config.externalApis.timeoutMilliseconds;
			setTimeout(() => {
				cancelTokenSource.cancel(this.TIMEOUT_CANCEL_MESSAGE);
			}, timeout);

			// Execute request via promises
			axios.request(options)
				.then((axiosResponse) => {
					const rawResponseBody = axiosResponse.data;
					this.logSuccessfulResponse(options, rawResponseBody, startNs, parameters.hideResponseBodyInLogs);

					// Check if we "trust" the API response to be valid...
					if(parameters.assumeWellFormedResponse) {
						// Skip validation and return the raw response
						resolve(rawResponseBody);
					}
					else if(parameters.responseBodyClass) {
						// Parse and validate the raw response
						this.parseResponse(options, parameters.responseBodyClass, rawResponseBody, parameters.discardInvalidResponseItems)
							.then((parsedResponse) => {
								resolve(parsedResponse);
							})
							.catch((error) => {
								logger.error('External API response parse error: %s', error);
								reject(AppError.EXTERNAL_API_PARSE.withDetails(error));
							});
					}
					else {
						reject(AppError.EXTERNAL_API_PARSE.withDetails('Missing response body class'));
					}
				})
				.catch((error) => {
					logger.error('External Service %s %s - Invocation error after %s: %s', options.method, options.url, elapsedTime.since(startNs), error);

					if(this.isTimeout(error)) {
						reject(AppError.EXTERNAL_API_TIMEOUT.withDetails(error));
					}
					else {
						reject(AppError.EXTERNAL_API_GENERIC.withDetails(error));
					}
				});
		});
	}

	/**
	 * Helper to parse and validate the raw response body
	 * @param options the request options
	 * @param responseBodyClass the response class
	 * @param rawResponseBody the raw response body
	 * @param discardInvalidItems if true, the list items that fail validation are discarded instead of rejecting the whole response
	 * @returns the parsed response, as a promise
	 * @template TResponse the response class
	 */
	private parseResponse<TResponse extends object>(options: AxiosRequestConfig, responseBodyClass: ClassType<TResponse>, rawResponseBody: object, discardInvalidItems: boolean | undefined): Promise<TResponse> {
		if(discardInvalidItems) {
			return parserValidator.parseAndValidateDiscardingInvalidItems(responseBodyClass, rawResponseBody)
				.then((parseResult) => {
					this.logDiscardedItems(options, parseResult.discardedItems);
					return parseResult.value;
				});
		}
		else {
			return parserValidator.parseAndValidate(responseBodyClass, rawResponseBody);
		}
	}

	/**
	 * Helper to log the response list items that were discarded because they failed validation
	 * @param options the request options
	 * @param discardedItems the number of discarded items
	 */
	private logDiscardedItems(options: AxiosRequestConfig, discardedItems: number): void {
		if(discardedItems > 0) {
			logger.warn('External Service %s %s - Discarded %s invalid response list item(s)', options.method, options.url, discardedItems);
		}
	}

	/**
	 * Helper to get the request body in the right format
	 * @param requestBody the source request body
	 * @returns the request body ready for axios
	 */
	private getRequestBody<TRequest extends object | string | undefined>(requestBody: TRequest): string | TRequest {
		if(typeof requestBody === 'string') {
			return requestBody;
		}
		else if(requestBody) {
			return JSON.stringify(requestBody);
		}
		else {
			return requestBody;
		}
	}

	/**
	 * Helper to determine if the back-end invocation timed out
	 * @param error the generic error
	 * @returns true if it's a timeout error
	 */
	private isTimeout(error: unknown): boolean {
		if(this.isAxiosError(error)) {
			const axiosError = error as AxiosError;
			return (axiosError.response && axiosError.response.status === 408) || axiosError.code === 'ECONNABORTED';
		}
		
		return this.isCancelError(error);
	}

	/**
	 * Helper to check if a generic error is an AxiosError
	 * @param error the generic error
	 * @returns true if it's an AxiosError
	 */
	private isAxiosError(error: unknown): boolean {
		if(error) {
			const possiblyAxiosError = error as AxiosError;
			return possiblyAxiosError.isAxiosError;
		}

		return false;
	}

	/**
	 * Helper to check if a generic error is the timeout cancel error
	 * @param error the generic error
	 * @returns true if it's the timeout cancel error
	 */
	private isCancelError(error: unknown): boolean {
		if(error) {
			const possiblyCancel = error as Cancel;
			return possiblyCancel.message === this.TIMEOUT_CANCEL_MESSAGE;
		}

		return false;
	}

	/**
	 * Helper to log the request
	 * @param options the request options
	 * @param hideRequestBody whether the request body should be hidden
	 */
	private logRequest(options: AxiosRequestConfig, hideRequestBody?: boolean): void {
		if(config.log.externalApisInputOutput.active) {
			const requestBody = hideRequestBody ? '<hidden>' : options.data;
			logger.info('External Service %s %s %s - Sent Request: %s', options.method, options.url, options.params, requestBody);
		}
	}

	/**
	 * Helper to log the successful response, with the time the invocation took printed inline
	 * @param options the request options
	 * @param rawResponseBody the response body
	 * @param startNs the invocation start
	 * @param hideResponseBody whether the response body should be hidden
	 */
	private logSuccessfulResponse(options: AxiosRequestConfig, rawResponseBody: unknown, startNs: bigint, hideResponseBody?: boolean): void {
		if(config.log.externalApisInputOutput.active) {
			const responseBody = hideResponseBody ? '<hidden>' : rawResponseBody;
			logger.info('External Service %s %s - Received Response in %s: %s', options.method, options.url, elapsedTime.since(startNs), responseBody);
		}
	}
}

/**
 * Singleton implementation of the JSON REST invoker
 */
export const restJsonInvoker = new RestJsonInvoker();
