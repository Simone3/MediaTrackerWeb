import { config } from 'app/config/config';
import { RestJsonInvoker } from 'app/controllers/core/common/rest-json-invoker';
import { AppError } from 'app/data/models/internal/error';
import { InvocationParams } from 'app/utilities/helper-types';
import { parserValidator } from 'app/utilities/parser-validator';
import axios, { AxiosError, AxiosRequestConfig, Cancel } from 'axios';

/**
 * Implementation of the RestJsonInvoker that uses Axios to invoke services via HTTP
 * @see RestJsonInvoker
 */
export class RestJsonInvokerAxios implements RestJsonInvoker {

	private readonly TIMEOUT_CANCEL_MESSAGE = 'custom-timeout';

	/**
	 * @override
	 */
	public invoke<TRequest extends object | undefined, TResponse extends object>(parameters: InvocationParams<TRequest, TResponse>): Promise<TResponse> {

		return new Promise((resolve, reject): void => {

			// eslint-disable-next-line import/no-named-as-default-member
			const cancelTokenSource = axios.CancelToken.source();

			// Build request options
			const options: AxiosRequestConfig = {
				url: parameters.url,
				method: parameters.method,
				params: parameters.queryParams,
				data: parameters.requestBody ? JSON.stringify(parameters.requestBody) : parameters.requestBody,
				cancelToken: cancelTokenSource.token,
				headers: {
					...parameters.headers,
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Accept-Charset': 'utf-8'
				}
			};
			this.logRequest(options);

			// Custom timeout handling (timeout field in options only handles connection timeout)
			const timeout = parameters.timeoutMilliseconds ? parameters.timeoutMilliseconds : config.backEnd.defaultTimeoutMilliseconds;
			setTimeout(() => {
				cancelTokenSource.cancel(this.TIMEOUT_CANCEL_MESSAGE);
			}, timeout);

			// Execute request via promises
			axios.request(options)
				.then((axiosResponse) => {
	
					const rawResponseBody = axiosResponse.data;
					this.logSuccessfulResponse(options, rawResponseBody);

					// Check if we "trust" the API response to be valid...
					if(parameters.assumeWellFormedResponse) {

						// Skip validation and return the raw response
						resolve(rawResponseBody);
					}
					else {

						// Parse and validate the raw response
						parserValidator.parseAndValidate(parameters.responseBodyClass, rawResponseBody)
							.then((parsedResponse) => {
		
								resolve(parsedResponse);
							})
							.catch((error) => {
		
								reject(AppError.BACKEND_PARSE.withDetails(error));
							});
					}
				})
				.catch((error) => {

					if(this.isTimeout(error)) {

						reject(AppError.BACKEND_TIMEOUT.withDetails(error));
					}
					else {
						
						reject(AppError.BACKEND_GENERIC_ERROR.withDetails(error));
					}
				});
		});
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
	 */
	private logRequest(options: AxiosRequestConfig): void {
		
		if(config.logging.logInvocations) {

			console.log(`Invoking ${options.method} ${options.url} with params = ${JSON.stringify(options.params)} and body = ${options.data}`);
		}
	}

	/**
	 * Helper to log the successful response
	 * @param options the request options
	 * @param rawResponseBody the response body
	 */
	private logSuccessfulResponse(options: AxiosRequestConfig, rawResponseBody: unknown): void {
		
		if(config.logging.logInvocations) {

			console.log(`Received response from ${options.method} ${options.url}: ${JSON.stringify(rawResponseBody)}`);
		}
	}
}
