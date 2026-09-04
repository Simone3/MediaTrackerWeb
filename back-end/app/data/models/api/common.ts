import { IsDefined, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

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
 * Generic response for a failure outcome
 */
export class ErrorResponse extends CommonResponse {
	/**
	 * A unique error code, should never be displayed to the user
	 */
	@IsOptional()
	@IsString()
	public errorCode: string;

	/**
	 * An error description, should never be displayed to the user
	 */
	@IsOptional()
	@IsString()
	public errorDescription: string;

	/**
	 * Optional details for the error, should never be displayed to the user
	 */
	@IsOptional()
	@IsString()
	public errorDetails?: string;
	
	/**
	 * Constructor
	 * @param errorCode source code
	 * @param errorDescription source description
	 * @param errorDetails source details
	 */
	public constructor(errorCode: string, errorDescription: string, errorDetails?: string) {
		super();

		this.errorCode = errorCode;
		this.errorDescription = errorDescription;
		this.errorDetails = errorDetails;
	}
}

/**
 * The maximum number of elements a single page of a paginated list API can contain. Arbitrary upper bound:
 * it keeps a client from asking for a page so large that pagination stops serving its purpose
 */
export const PAGINATION_MAX_LIMIT = 100;

/**
 * Pagination options that a list API request can optionally specify, publicly exposed via API. If the whole
 * block is omitted the API returns every matching element, but if it is present both fields are required:
 * a limit without an offset (or vice versa) would be an ambiguous request rather than a partial one
 */
export class PaginationRequest {
	/**
	 * The number of matching elements to skip before the first returned one
	 */
	@IsDefined()
	@IsInt()
	@Min(0)
	public offset!: number;

	/**
	 * The maximum number of elements to return
	 */
	@IsDefined()
	@IsInt()
	@Min(1)
	@Max(PAGINATION_MAX_LIMIT)
	public limit!: number;
}

/**
 * Pagination details returned by a list API, publicly exposed via API. Present only if the request asked
 * for a page, so that a caller that did not paginate gets exactly the response it got before
 */
export class PaginationResponse {
	/**
	 * The offset that produced this page, echoed back from the request
	 */
	@IsDefined()
	@IsInt()
	@Min(0)
	public offset!: number;

	/**
	 * The limit that produced this page, echoed back from the request
	 */
	@IsDefined()
	@IsInt()
	@Min(1)
	public limit!: number;

	/**
	 * The total number of elements matching the request, ignoring the pagination options: what the caller
	 * needs to tell whether another page exists
	 */
	@IsDefined()
	@IsInt()
	@Min(0)
	public totalCount!: number;
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
