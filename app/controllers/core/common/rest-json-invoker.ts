import { RestJsonInvokerAxios } from 'app/controllers/impl-prod/common/rest-json-invoker';
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

/**
 * Singleton implementation of the JSON REST invoker
 */
export const restJsonInvoker = new RestJsonInvokerAxios();
