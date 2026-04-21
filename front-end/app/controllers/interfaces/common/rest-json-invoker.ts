import { InvocationParams } from 'app/utilities/helper-types';

/**
 * Helper controller to invoke external JSON-based REST services
 */
export interface RestJsonInvoker {

	/**
	 * Invokes a JSON-based service
	 * @param parameters the method parameters container
	 * @returns the 200 service response, as a promise
	 * @template TRequest the request class
	 * @template TResponse the response class
	 */
	invoke<TRequest extends object, TResponse extends object>(parameters: InvocationParams<TRequest, TResponse>): Promise<TResponse>;
}
