import { CommonAddResponse, CommonRequest, CommonResponse, CommonSaveRequest, PaginationRequest, PaginationResponse } from 'app/data/models/api/common';
import { Group } from 'app/data/models/api/group';
import { OwnPlatform } from 'app/data/models/api/own-platform';
import { ValuesOf } from 'app/utilities/helper-types';
import { IsTimeZone } from 'app/utilities/validators';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsDefined, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, ValidateNested } from 'class-validator';

/**
 * Util class to extract common fields to both media item entities and catalog entries
 */
class CoreMediaItemData {
	/**
	 * The media item name
	 */
	@IsNotEmpty()
	@IsString()
	public name!: string;

	/**
	 * The list of media item genres
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public genres?: string[];

	/**
	 * The media item description
	 */
	@IsOptional()
	@IsString()
	public description?: string;

	/**
	 * The media item release date
	 */
	@IsOptional()
	@IsDateString()
	public releaseDate?: string;

	/**
	 * The URL to the thumbnail image
	 */
	@IsOptional()
	@IsString()
	public imageUrl?: string;

	/**
	 * The data source catalog reference
	 */
	@IsOptional()
	@IsString()
	public catalogId?: string;
}

/**
 * The maximum number of decimal digits allowed for a media item order inside a group
 */
export const MEDIA_ITEM_ORDER_IN_GROUP_MAX_DECIMALS = 1;

/**
 * The maximum value allowed for a media item order inside a group. Arbitrary upper bound: no series is
 * anywhere near this long, and it keeps the field from holding a nonsensical value
 */
export const MEDIA_ITEM_ORDER_IN_GROUP_MAX = 9999;

/**
 * Model for a media item group data, publicly exposed via API
 */
export class MediaItemGroup {
	/**
	 * The group ID
	 */
	@IsNotEmpty()
	@IsString()
	public groupId!: string;

	/**
	 * The group full data. Loaded by GET methods but not required by PUT/POST methods
	 */
	@IsOptional()
	@Type(() => {
		return Group;
	})
	@ValidateNested()
	public groupData?: Group;

	/**
	 * The media item order inside the group. Allows one decimal digit, so that a spin-off can sit
	 * between two main entries (e.g. 2.5), and must be greater than zero
	 */
	@IsNotEmpty()
	@IsNumber({ maxDecimalPlaces: MEDIA_ITEM_ORDER_IN_GROUP_MAX_DECIMALS })
	@IsPositive()
	@Max(MEDIA_ITEM_ORDER_IN_GROUP_MAX)
	public orderInGroup!: number;
}

/**
 * Model for a media item own platform, publicly exposed via API
 */
export class MediaItemOwnPlatform {
	/**
	 * The own platform ID
	 */
	@IsNotEmpty()
	@IsString()
	public ownPlatformId!: string;

	/**
	 * The own platform full data. Loaded by GET methods but not required by PUT/POST methods
	 */
	@IsOptional()
	@Type(() => {
		return OwnPlatform;
	})
	@ValidateNested()
	public ownPlatformData?: OwnPlatform;
}

/**
 * Array of all media item importance levels, publicly exposed via API
 */
export const MEDIA_ITEM_IMPORTANCE_VALUES: [ '100', '200', '300', '400' ] = [ '100', '200', '300', '400' ];

/**
 * The media item importance levels, publicly exposed via API
 */
export type MediaItemImportance = ValuesOf<typeof MEDIA_ITEM_IMPORTANCE_VALUES>;

/**
 * Abstract model for a media item, publicly exposed via API
 */
export abstract class MediaItem extends CoreMediaItemData {
	/**
	 * The media item importance level
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(MEDIA_ITEM_IMPORTANCE_VALUES)
	public importance!: MediaItemImportance;

	/**
	 * The media item group
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemGroup;
	})
	@ValidateNested()
	public group?: MediaItemGroup;

	/**
	 * The platform where the user owns the media item
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemOwnPlatform;
	})
	@ValidateNested()
	public ownPlatform?: MediaItemOwnPlatform;

	/**
	 * A user comment about the media item
	 */
	@IsOptional()
	@IsString()
	public userComment?: string;

	/**
	 * Dates on which the user "completed" (e.g. watched) the media item
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsDateString(undefined, { each: true })
	public completedOn?: string[];

	/**
	 * If the user marked the media item as currently active (e.g. currently reading)
	 */
	@IsOptional()
	@IsBoolean()
	public active?: boolean;

	/**
	 * If the user marked the media item as "redoing" (i.e. was completed in the past but the user moved it back to the "current" list to e.g. rewatch it)
	 */
	@IsOptional()
	@IsBoolean()
	public markedAsRedo?: boolean;
}

/**
 * Media items groups filtering options, publicly exposed via API
 */
export class MediaItemGroupFilter {
	/**
	 * If true, the result will include all media items with a group (i.e. group is not null)
	 */
	@IsOptional()
	@IsBoolean()
	public anyGroup?: boolean;

	/**
	 * If true, the result will include all media items without a group (i.e. group is null)
	 */
	@IsOptional()
	@IsBoolean()
	public noGroup?: boolean;

	/**
	 * Group IDs to filter
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public groupIds?: string[];
}

/**
 * Media items own platforms filtering options, publicly exposed via API
 */
export class MediaItemOwnPlatformFilter {
	/**
	 * If true, the result will include all media items with an own platform (i.e. own platform is not null)
	 */
	@IsOptional()
	@IsBoolean()
	public anyOwnPlatform?: boolean;

	/**
	 * If true, the result will include all media items without an own platform (i.e. own platform is null)
	 */
	@IsOptional()
	@IsBoolean()
	public noOwnPlatform?: boolean;

	/**
	 * Own platform IDs to filter
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public ownPlatformIds?: string[];
}

/**
 * Abstract media items filtering options, publicly exposed via API
 */
export abstract class MediaItemFilter {
	/**
	 * Importance level(s) to filter
	 */
	@IsOptional()
	@IsNotEmpty({ each: true })
	@IsString({ each: true })
	@IsIn(MEDIA_ITEM_IMPORTANCE_VALUES, { each: true })
	public importanceLevels?: MediaItemImportance[];

	/**
	 * Filter for groups
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemGroupFilter;
	})
	@ValidateNested()
	public groups?: MediaItemGroupFilter;

	/**
	 * Filter for own platforms
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemOwnPlatformFilter;
	})
	@ValidateNested()
	public ownPlatforms?: MediaItemOwnPlatformFilter;
	
	/**
	 * Filter for completed but not marked as redo media items
	 */
	@IsOptional()
	@IsBoolean()
	public complete?: boolean;
	
	/**
	 * Filter for name (case-insensitive exact match)
	 */
	@IsOptional()
	@IsString()
	public name?: string;
}

/**
 * Common values for ordering options, publicly exposed via API
 */
export abstract class MediaItemSortField {
	public static readonly IMPORTANCE: string = 'IMPORTANCE';
	public static readonly NAME: string = 'NAME';
	public static readonly GROUP: string = 'GROUP';
	public static readonly OWN_PLATFORM: string = 'OWN_PLATFORM';
	public static readonly COMPLETION_DATE: string = 'COMPLETION_DATE';
	public static readonly ACTIVE: string = 'ACTIVE';
	public static readonly RELEASE_DATE: string = 'RELEASE_DATE';
	
	public static commonValues(): string[] {
		return [ this.IMPORTANCE, this.NAME, this.GROUP, this.OWN_PLATFORM, this.COMPLETION_DATE, this.ACTIVE, this.RELEASE_DATE ];
	}
}

/**
 * Abstract media items sort by options, publicly exposed via API
 */
export abstract class MediaItemSortBy {
	/**
	 * True if ASC, false if DESC
	 */
	@IsDefined()
	@IsBoolean()
	public ascending!: boolean;
}

/**
 * Abstract request for the 'add media item' API
 */
export abstract class AddMediaItemRequest extends CommonSaveRequest {
}

/**
 * Response for the 'add media item' API
 */
export class AddMediaItemResponse extends CommonAddResponse {
}

/**
 * Response for the 'delete media item' API
 */
export class DeleteMediaItemResponse extends CommonResponse {
}

/**
 * Abstract response for the 'get all media items' API
 */
export abstract class GetAllMediaItemsResponse extends CommonResponse {
}

/**
 * Abstract request for the 'update media item' API
 */
export abstract class UpdateMediaItemRequest extends CommonSaveRequest {
}

/**
 * Response for the 'update media item' API
 */
export class UpdateMediaItemResponse extends CommonResponse {
}

/**
 * Abstract request for the 'filter media items' API
 */
export abstract class FilterMediaItemsRequest extends CommonRequest {
	/**
	 * Optional pagination options. If omitted, every matching media item is returned
	 */
	@IsOptional()
	@Type(() => {
		return PaginationRequest;
	})
	@ValidateNested()
	public pagination?: PaginationRequest;
}

/**
 * Abstract response for the 'filter media items' API
 */
export abstract class FilterMediaItemsResponse extends CommonResponse {
	/**
	 * The pagination details, returned only if the request asked for a page
	 */
	@IsOptional()
	@Type(() => {
		return PaginationResponse;
	})
	@ValidateNested()
	public pagination?: PaginationResponse;
}

/**
 * Abstract request for the 'search media items' API
 */
export abstract class SearchMediaItemsRequest extends CommonRequest {
	/**
	 * The search term
	 */
	@IsNotEmpty()
	@IsString()
	public searchTerm!: string;

	/**
	 * Optional pagination options. If omitted, every matching media item is returned
	 */
	@IsOptional()
	@Type(() => {
		return PaginationRequest;
	})
	@ValidateNested()
	public pagination?: PaginationRequest;
}

/**
 * Abstract response for the 'search media items' API
 */
export abstract class SearchMediaItemsResponse extends CommonResponse {
	/**
	 * The pagination details, returned only if the request asked for a page
	 */
	@IsOptional()
	@Type(() => {
		return PaginationResponse;
	})
	@ValidateNested()
	public pagination?: PaginationResponse;
}

/**
 * Abstract model for a media item from the catalog, publicly exposed via API
 */
export abstract class CatalogMediaItem extends CoreMediaItemData {
}

/**
 * Abstract media item catalog search result, publicly exposed via API
 */
export abstract class SearchMediaItemCatalogResult {
	@IsNotEmpty()
	@IsString()
	public catalogId = '';
	
	@IsNotEmpty()
	@IsString()
	public name = '';

	@IsOptional()
	@IsDateString()
	public releaseDate?: string;
}

/**
 * Abstract response for the 'search catalog' API
 */
export abstract class SearchMediaItemCatalogResponse extends CommonResponse {
	/**
	 * The search results
	 */
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return SearchMediaItemCatalogResult;
	})
	@ValidateNested()
	public searchResults: SearchMediaItemCatalogResult[] = [];
}

/**
 * Abstract response for the 'get from catalog' API
 */
export abstract class GetMediaItemFromCatalogResponse extends CommonResponse {
}

/**
 * Array of all media item backlog statuses, publicly exposed via API
 */
export const MEDIA_ITEM_BACKLOG_STATUS_VALUES: [ 'NEW', 'ACTIVE', 'UPCOMING', 'REDO' ] = [ 'NEW', 'ACTIVE', 'UPCOMING', 'REDO' ];

/**
 * The media item statuses a backlog entry can have, publicly exposed via API
 */
export type MediaItemBacklogStatus = ValuesOf<typeof MEDIA_ITEM_BACKLOG_STATUS_VALUES>;

/**
 * Media items stats filtering options, publicly exposed via API. It reuses the group and own platform blocks of the
 * 'filter media items' API unchanged, so that the stats screen and the list screen mean the same thing by the same
 * words. It deliberately has nothing else: the stats break the backlog down by importance and by own platform, and
 * filtering by either of those axes would reduce the corresponding chart to a single value
 */
export class MediaItemsStatsFilter {
	/**
	 * Filter for groups
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemGroupFilter;
	})
	@ValidateNested()
	public groups?: MediaItemGroupFilter;

	/**
	 * Filter for own platforms
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemOwnPlatformFilter;
	})
	@ValidateNested()
	public ownPlatforms?: MediaItemOwnPlatformFilter;
}

/**
 * Request for the 'get media items stats' API
 */
export class GetMediaItemsStatsRequest extends CommonRequest {
	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => {
		return MediaItemsStatsFilter;
	})
	@ValidateNested()
	public filter?: MediaItemsStatsFilter;

	/**
	 * The time zone the completion years must be computed in, as an IANA identifier such as 'Europe/Rome' or a UTC
	 * offset such as '+02:00', defaulting to UTC when absent.
	 * Completion dates are written by the client at local midnight and stored as the corresponding instant, so a
	 * completion dated the 1st of January is stored in the previous year for any client east of Greenwich: grouping
	 * them without the client's own time zone would put those completions in the wrong bar
	 */
	@IsOptional()
	@IsTimeZone()
	public timezone?: string;
}

/**
 * The number of media item completions in one year, publicly exposed via API
 */
export class MediaItemsStatsYear {
	/**
	 * The year
	 */
	@IsDefined()
	@IsInt()
	public year!: number;

	/**
	 * The number of completions in the year
	 */
	@IsDefined()
	@IsInt()
	public count!: number;
}

/**
 * The number of backlog media items in one status, publicly exposed via API
 */
export class MediaItemsStatsStatus {
	/**
	 * The status
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(MEDIA_ITEM_BACKLOG_STATUS_VALUES)
	public status!: MediaItemBacklogStatus;

	/**
	 * The number of backlog media items in the status
	 */
	@IsDefined()
	@IsInt()
	public count!: number;
}

/**
 * The number of backlog media items with one importance level on one own platform, publicly exposed via API
 */
export class MediaItemsStatsImportanceAndOwnPlatform {
	/**
	 * The importance level
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(MEDIA_ITEM_IMPORTANCE_VALUES)
	public importance!: MediaItemImportance;

	/**
	 * The own platform ID, or null for the media items the user does not own
	 */
	@IsOptional()
	@IsString()
	public ownPlatformId!: string | null;

	/**
	 * The number of backlog media items with the importance level on the own platform
	 */
	@IsDefined()
	@IsInt()
	public count!: number;
}

/**
 * The number of media items a stats request covers, publicly exposed via API
 */
export class MediaItemsStatsMediaItems {
	/**
	 * The number of media items in the category, ignoring the request filter
	 */
	@IsDefined()
	@IsInt()
	public total!: number;

	/**
	 * The number of media items matching the request filter
	 */
	@IsDefined()
	@IsInt()
	public filtered!: number;
}

/**
 * The completions half of the media items stats, publicly exposed via API
 */
export class MediaItemsStatsCompletions {
	/**
	 * The total number of completion dates, whatever the status of the media items carrying them
	 */
	@IsDefined()
	@IsInt()
	public total!: number;

	/**
	 * The number of distinct media items completed at least once
	 */
	@IsDefined()
	@IsInt()
	public mediaItems!: number;

	/**
	 * The completions grouped by year, ordered by year and WITHOUT the years that have none: the client knows the
	 * current year and fills the gaps, which keeps the payload proportional to the data rather than to the range
	 */
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return MediaItemsStatsYear;
	})
	@ValidateNested()
	public byYear: MediaItemsStatsYear[] = [];
}

/**
 * The backlog half of the media items stats, publicly exposed via API
 */
export class MediaItemsStatsBacklog {
	/**
	 * The number of media items whose status is not 'COMPLETE'
	 */
	@IsDefined()
	@IsInt()
	public total!: number;

	/**
	 * The backlog grouped by status, WITHOUT the statuses that have no media item
	 */
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return MediaItemsStatsStatus;
	})
	@ValidateNested()
	public byStatus: MediaItemsStatsStatus[] = [];

	/**
	 * The backlog grouped by importance level and own platform, WITHOUT the combinations that have no media item
	 */
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return MediaItemsStatsImportanceAndOwnPlatform;
	})
	@ValidateNested()
	public byImportanceAndOwnPlatform: MediaItemsStatsImportanceAndOwnPlatform[] = [];
}

/**
 * Response for the 'get media items stats' API
 */
export class GetMediaItemsStatsResponse extends CommonResponse {
	/**
	 * The number of media items the stats cover
	 */
	@IsDefined()
	@Type(() => {
		return MediaItemsStatsMediaItems;
	})
	@ValidateNested()
	public mediaItems!: MediaItemsStatsMediaItems;

	/**
	 * What the user has finished
	 */
	@IsDefined()
	@Type(() => {
		return MediaItemsStatsCompletions;
	})
	@ValidateNested()
	public completions!: MediaItemsStatsCompletions;

	/**
	 * What the user has left to do
	 */
	@IsDefined()
	@Type(() => {
		return MediaItemsStatsBacklog;
	})
	@ValidateNested()
	public backlog!: MediaItemsStatsBacklog;
}
