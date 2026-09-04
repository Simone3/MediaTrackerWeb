import { CategoryInternal } from 'app/data/models/internal/category';
import { PersistedEntityInternal } from 'app/data/models/internal/common';
import { GroupInternal } from 'app/data/models/internal/group';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { ValuesOf } from 'app/utilities/helper-types';

/**
 * Util type to extract common fields to both media item entities and catalog entries
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
 * The media item importance levels, internal type NOT to be exposed via API
 */
export type MediaItemImportanceInternal = '100' | '200' | '300' | '400';

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type MediaItemInternal = PersistedEntityInternal & CoreMediaItemDataInternal & {
	category: CategoryInternal | string;
	group?: GroupInternal | string;
	orderInGroup?: number;
	ownPlatform?: OwnPlatformInternal | string;
	owner: string;
	importance: MediaItemImportanceInternal;
	userComment?: string;
	completedOn?: Date[];
	completedLastOn?: Date;
	active?: boolean;
	markedAsRedo?: boolean;
};

/**
 * Media items groups filtering options, internal type NOT to be exposed via API
 */
export type MediaItemGroupFilterInternal = {
	anyGroup?: boolean;
	noGroup?: boolean;
	groupIds?: string[];
};

/**
 * Media items own platforms filtering options, internal type NOT to be exposed via API
 */
export type MediaItemOwnPlatformFilterInternal = {
	anyOwnPlatform?: boolean;
	noOwnPlatform?: boolean;
	ownPlatformIds?: string[];
};

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type MediaItemFilterInternal = {
	importanceLevels?: MediaItemImportanceInternal[];
	groups?: MediaItemGroupFilterInternal;
	ownPlatforms?: MediaItemOwnPlatformFilterInternal;
	complete?: boolean;
	name?: string;
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export type MediaItemSortFieldInternal = 'IMPORTANCE' | 'NAME' | 'GROUP' | 'OWN_PLATFORM' | 'COMPLETION_DATE' | 'ACTIVE' | 'RELEASE_DATE';

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type MediaItemSortByInternal = {
	ascending: boolean;
};

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogMediaItemInternal = CoreMediaItemDataInternal & {
};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchMediaItemCatalogResultInternal = {
	catalogId: string;
	name: string;
	releaseDate?: Date;
};

/**
 * Array of all media item backlog statuses, in the order they are reported, internal type NOT to be exposed via API
 */
export const INTERNAL_MEDIA_ITEM_BACKLOG_STATUSES: [ 'NEW', 'ACTIVE', 'UPCOMING', 'REDO' ] = [ 'NEW', 'ACTIVE', 'UPCOMING', 'REDO' ];

/**
 * The media item statuses a backlog entry can have, internal type NOT to be exposed via API. 'COMPLETE' is not one of
 * them on purpose: an item in that state is exactly what the backlog leaves out
 */
export type MediaItemBacklogStatusInternal = ValuesOf<typeof INTERNAL_MEDIA_ITEM_BACKLOG_STATUSES>;

/**
 * The number of media item completions in one year, internal type NOT to be exposed via API
 */
export type MediaItemsStatsYearInternal = {
	year: number;
	count: number;
};

/**
 * The number of backlog media items in one status, internal type NOT to be exposed via API
 */
export type MediaItemsStatsStatusInternal = {
	status: MediaItemBacklogStatusInternal;
	count: number;
};

/**
 * The number of backlog media items with one importance level on one own platform, internal type NOT to be exposed
 * via API. An undefined own platform is the "not owned" bucket
 */
export type MediaItemsStatsImportanceAndOwnPlatformInternal = {
	importance: MediaItemImportanceInternal;
	ownPlatformId?: string;
	count: number;
};

/**
 * Aggregated statistics for the media items of a category, internal type NOT to be exposed via API.
 *
 * The three blocks answer three different questions and are deliberately not comparable with each other: 'mediaItems'
 * counts entities, 'completions' counts completion dates whatever the item status, and 'backlog' counts the items that
 * are not complete. An item completed twice and marked for redo contributes 1, 2 and 1 respectively
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
