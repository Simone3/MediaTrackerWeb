import { config } from 'app/config/config';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { TwitchAuthTokenResponse } from 'app/data/models/external-services/twitch-auth';
import { InvocationParams } from 'app/utilities/helper-types';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Helper controller to retrieve and cache Twitch app access tokens
 */
class TwitchAuthTokenProvider {
	private readonly EXPIRATION_SAFETY_MARGIN_SECONDS = 60;
	private accessToken?: string;
	private expiresAtMillis?: number;

	/**
	 * Retrieves a valid Twitch app access token
	 * @returns a valid access token, as a promise
	 */
	public getAccessToken(): Promise<string> {
		if(this.accessToken && this.expiresAtMillis && this.expiresAtMillis > Date.now()) {
			return Promise.resolve(this.accessToken);
		}

		return this.refreshAccessToken();
	}

	/**
	 * Requests a new Twitch app access token
	 * @returns a valid access token, as a promise
	 */
	private refreshAccessToken(): Promise<string> {
		const authConfig = config.externalApis.igdb.auth;
		const url = miscUtils.buildUrl([
			authConfig.basePath,
			authConfig.relativePath
		]);

		const requestBody = new URLSearchParams({
			client_id: authConfig.clientId,
			client_secret: authConfig.clientSecret,
			grant_type: authConfig.grantType
		}).toString();

		const invocationParams: InvocationParams<string, TwitchAuthTokenResponse> = {
			method: 'POST',
			url: url,
			requestBody: requestBody,
			requestContentType: 'application/x-www-form-urlencoded',
			responseBodyClass: TwitchAuthTokenResponse,
			timeoutMilliseconds: config.externalApis.timeoutMilliseconds,
			hideRequestBodyInLogs: true,
			hideResponseBodyInLogs: true
		};

		return restJsonInvoker.invoke(invocationParams)
			.then((response) => {
				this.accessToken = response.access_token;
				this.expiresAtMillis = Date.now() + this.getRefreshDelayMillis(response.expires_in);
				return response.access_token;
			});
	}

	/**
	 * Calculates the token refresh delay
	 * @param expiresInSeconds token lifetime in seconds
	 * @returns token refresh delay in milliseconds
	 */
	private getRefreshDelayMillis(expiresInSeconds: number): number {
		const refreshInSeconds = Math.max(expiresInSeconds - this.EXPIRATION_SAFETY_MARGIN_SECONDS, Math.floor(expiresInSeconds / 2));
		return refreshInSeconds * 1000;
	}
}

/**
 * Singleton implementation of the Twitch auth token provider
 */
export const twitchAuthTokenProvider = new TwitchAuthTokenProvider();
