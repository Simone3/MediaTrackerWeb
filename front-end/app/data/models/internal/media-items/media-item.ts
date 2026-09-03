import { MediaTypeInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { ValuesOf } from 'app/utilities/helper-types';

/**
 * Common core data for media items, internal type just for display purposes
 */
type CoreMediaItemDataInternal = {

	name: string;
	genres?: string[];
	description?: string;
	releaseDate?: Date;
	imageUrl?: string;
	catalogId?: string;
};

/**
 * Array of all media item importance levels, internal type just for display purposes
 */
export const MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES: [ '400', '300', '200', '100' ] = [ '400', '300', '200', '100' ];

/**
 * The media item importance levels, internal type just for display purposes
 */
export type MediaItemImportanceInternal = ValuesOf<typeof MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES>;

/**
 * Array of all media item "status" values, internal type just for display purposes
 */
export const MEDIA_ITEM_STATUS_INTERNAL_VALUES: [ 'ACTIVE', 'UPCOMING', 'REDO', 'COMPLETE', 'NEW' ] = [ 'ACTIVE', 'UPCOMING', 'REDO', 'COMPLETE', 'NEW' ];

/**
 * The media type "status" (helper label based on other media item data), internal type just for display purposes
 */
export type MediaItemStatusInternal = ValuesOf<typeof MEDIA_ITEM_STATUS_INTERNAL_VALUES>;

/**
 * The maximum number of decimal digits allowed for a media item order inside a group. Mirrors the
 * API bound in MEDIA_ITEM_ORDER_IN_GROUP_MAX_DECIMALS
 */
export const MEDIA_ITEM_ORDER_IN_GROUP_INTERNAL_MAX_DECIMALS = 1;

/**
 * The maximum value allowed for a media item order inside a group. Mirrors the API bound in
 * MEDIA_ITEM_ORDER_IN_GROUP_MAX
 */
export const MEDIA_ITEM_ORDER_IN_GROUP_INTERNAL_MAX = 9999;

/**
 * A generic media item, internal type just for display purposes
 */
export type MediaItemInternal = CoreMediaItemDataInternal & {

	id: string;
	mediaType: MediaTypeInternal;
	status: MediaItemStatusInternal;
	importance: MediaItemImportanceInternal;
	group?: GroupInternal;
	orderInGroup?: number;
	ownPlatform?: OwnPlatformInternal;
	userComment?: string;
	completedOn?: Date[];
	active?: boolean;
	markedAsRedo?: boolean;
};

/**
 * Media items groups filtering options, internal type just for display purposes
 */
export type MediaItemGroupFilterInternal = {
	
	anyGroup?: boolean;
	noGroup?: boolean;
	groupIds?: string[];

	/**
	 * The display names of the filtered groups, in the same order as groupIds. Purely a display aid: it lets the filter form label a
	 * selected group before (or without) the groups list being available, and it is never sent to the back end.
	 * A slot is undefined when the name is not known, since the array has to stay aligned with groupIds
	 */
	groupNames?: (string | undefined)[];
};

/**
 * Media items own platforms filtering options, internal type just for display purposes
 */
export type MediaItemOwnPlatformFilterInternal = {
	
	anyOwnPlatform?: boolean;
	noOwnPlatform?: boolean;
	ownPlatformIds?: string[];

	/**
	 * The display names of the filtered own platforms, in the same order as ownPlatformIds. Purely a display aid: it lets the filter form
	 * label a selected own platform before (or without) the own platforms list being available, and it is never sent to the back end.
	 * A slot is undefined when the name is not known, since the array has to stay aligned with ownPlatformIds
	 */
	ownPlatformNames?: (string | undefined)[];
};

/**
 * The media type "status" filter, internal type just for display purposes
 */
export type MediaItemStatusFilterInternal = 'CURRENT' | 'COMPLETE';

/**
 * A filter for generic media items, internal type just for display purposes
 */
export type MediaItemFilterInternal = {

	importanceLevels?: MediaItemImportanceInternal[];
	groups?: MediaItemGroupFilterInternal;
	ownPlatforms?: MediaItemOwnPlatformFilterInternal;
	status?: MediaItemStatusFilterInternal;
	name?: string;
};

/**
 * Sort fields for a generic media item, internal type just for display purposes
 */
export type MediaItemSortFieldInternal = 'IMPORTANCE' | 'NAME' | 'GROUP' | 'OWN_PLATFORM' | 'COMPLETION_DATE' | 'ACTIVE' | 'RELEASE_DATE';

/**
 * A sort by filter for generic media items, internal type just for display purposes
 */
export type MediaItemSortByInternal = {

	ascending: boolean;
};

/**
 * A generic catalog media item, internal type just for display purposes
 */
export type CatalogMediaItemInternal = CoreMediaItemDataInternal & {

	catalogLoadId: string;
};

/**
 * Media item catalog search result, internal type just for display purposes
 */
export type SearchMediaItemCatalogResultInternal = {

	catalogId: string;
	name: string;
	releaseDate?: Date;
};

/**
 * Array of all media item backlog statuses, in the order the stats screen reports them, internal type just for display purposes
 */
export const MEDIA_ITEM_BACKLOG_STATUS_INTERNAL_VALUES: [ 'NEW', 'ACTIVE', 'UPCOMING', 'REDO' ] = [ 'NEW', 'ACTIVE', 'UPCOMING', 'REDO' ];

/**
 * The media item statuses a backlog entry can have, internal type just for display purposes. 'COMPLETE' is not one of them on purpose:
 * an item in that state is exactly what the backlog leaves out
 */
export type MediaItemBacklogStatusInternal = ValuesOf<typeof MEDIA_ITEM_BACKLOG_STATUS_INTERNAL_VALUES>;

/**
 * A filter for the media items stats, internal type just for display purposes. It deliberately has neither an importance nor a status
 * option: the stats break the backlog down by both, and filtering by either would reduce the corresponding chart to a single value
 */
export type MediaItemsStatsFilterInternal = {

	groups?: MediaItemGroupFilterInternal;
	ownPlatforms?: MediaItemOwnPlatformFilterInternal;
};

/**
 * The number of media item completions in one year, internal type just for display purposes
 */
export type MediaItemsStatsYearInternal = {

	year: number;
	count: number;
};

/**
 * The number of backlog media items in one status, internal type just for display purposes
 */
export type MediaItemsStatsStatusInternal = {

	status: MediaItemBacklogStatusInternal;
	count: number;
};

/**
 * The number of backlog media items with one importance level on one own platform, internal type just for display purposes. An undefined
 * own platform is the "not owned" bucket
 */
export type MediaItemsStatsImportanceAndOwnPlatformInternal = {

	importance: MediaItemImportanceInternal;
	ownPlatformId?: string;
	count: number;
};

/**
 * Aggregated statistics for the media items of a category, internal type just for display purposes.
 *
 * The three blocks answer three different questions and are deliberately not comparable with each other: 'mediaItems' counts entities,
 * 'completions' counts completion dates whatever the item status, and 'backlog' counts the items that are not complete. An item
 * completed twice and marked for redo contributes 1, 2 and 1 respectively
 */
export type MediaItemsStatsInternal = {

	mediaItems: {
		total: number;
		filtered: number;
	};
	completions: {
		total: number;
		mediaItems: number;
		byYear: MediaItemsStatsYearInternal[];
	};
	backlog: {
		total: number;
		byStatus: MediaItemsStatsStatusInternal[];
		byImportanceAndOwnPlatform: MediaItemsStatsImportanceAndOwnPlatformInternal[];
	};
};
