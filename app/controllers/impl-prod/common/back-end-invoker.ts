import { config } from 'app/config/config';
import { BackEndInvoker } from 'app/controllers/core/common/back-end-invoker';
import { restJsonInvoker } from 'app/controllers/core/common/rest-json-invoker';
import { userController } from 'app/controllers/core/entities/user';
import { InvocationParams } from 'app/utilities/helper-types';

/**
 * Implementation of the BackEndInvoker that uses the REST JSON-based back-end APIs
 * @see BackEndInvoker
 */
export class BackEndInvokerRestJson implements BackEndInvoker {

	/**
	 * @override
	 */
	public async invoke<TRequest extends object, TResponse extends object>(parameters: InvocationParams<TRequest, TResponse>): Promise<TResponse> {

		await this.addAuthorizationHeader(parameters);
		parameters.assumeWellFormedResponse = config.backEnd.assumeWellFormedResponse;
		return restJsonInvoker.invoke(parameters);
	}

	/**
	 * Helper to inject the Media Tracker back-end APIs "Authorization" header
	 * @param parameters the invocation parameters
	 */
	private async addAuthorizationHeader(parameters: InvocationParams<unknown, unknown>): Promise<void> {

		// Get the user access token
		const accessToken = await userController.getCurrentUserAccessToken();
			
		// Add the Authorization header
		const headers = parameters.headers || {};
		headers.Authorization = `Bearer ${accessToken}`;
		parameters.headers = headers;
	}
}
