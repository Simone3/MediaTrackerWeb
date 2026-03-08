import { BackEndInvokerRestJson } from 'app/controllers/impl-prod/common/back-end-invoker';
import { InvocationParams } from 'app/utilities/helper-types';

/**
 * Helper controller to invoke the Media Tracker back-end APIs
 */
export interface BackEndInvoker {

	/**
	 * Invokes a Media Tracker back-end API
	 * @param parameters the method parameters container
	 * @returns the 200 service response, as a promise
	 * @template TRequest the request class
	 * @template TResponse the response class
	 */
	invoke<TRequest extends object, TResponse extends object>(parameters: InvocationParams<TRequest, TResponse>): Promise<TResponse>;
}

/**
 * Singleton implementation of the Media Tracker back-end APIs invoker
 */
export const backEndInvoker = new BackEndInvokerRestJson();
