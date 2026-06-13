import { IsInt, IsNotEmpty, IsString } from 'class-validator';

/**
 * Response of the Twitch app access token service
 */
export class TwitchAuthTokenResponse {
	@IsNotEmpty()
	@IsString()
	public access_token!: string;

	@IsNotEmpty()
	@IsInt()
	public expires_in!: number;

	@IsNotEmpty()
	@IsString()
	public token_type!: string;
}
