import { IsDefined, IsOptional, IsString } from 'class-validator';

/**
 * Type shared by all API requests
 */
export class CommonRequest {

}

/**
 * Type shared by all API responses
 */
export class CommonResponse {

	/**
	 * A generic message for easy response reading, should never be displayed to the user
	 */
	@IsOptional()
	@IsString()
	public message?: string;
}

/**
 * Type that can be extended by insert or update API requests for common fields
 */
export class CommonSaveRequest extends CommonRequest {

}

/**
 * Type that can be extended by "add new" APIs to return the new entity ID
 */
export class CommonAddResponse extends CommonResponse {

	/**
	 * The new element unique ID
	 */
	@IsDefined()
	@IsString()
	public uid!: string;
}
