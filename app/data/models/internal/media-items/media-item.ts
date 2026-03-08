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
}

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
}

/**
 * Media items groups filtering options, internal type just for display purposes
 */
export type MediaItemGroupFilterInternal = {
	
	anyGroup?: boolean;
	noGroup?: boolean;
	groupIds?: string[];
}

/**
 * Media items own platforms filtering options, internal type just for display purposes
 */
export type MediaItemOwnPlatformFilterInternal = {
	
	anyOwnPlatform?: boolean;
	noOwnPlatform?: boolean;
	ownPlatformIds?: string[];
}

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
}

/**
 * Sort fields for a generic media item, internal type just for display purposes
 */
export type MediaItemSortFieldInternal = 'IMPORTANCE' | 'NAME' | 'GROUP' | 'OWN_PLATFORM' | 'COMPLETION_DATE' | 'ACTIVE' | 'RELEASE_DATE';

/**
 * A sort by filter for generic media items, internal type just for display purposes
 */
export type MediaItemSortByInternal = {

	ascending: boolean;
}

/**
 * A generic catalog media item, internal type just for display purposes
 */
export type CatalogMediaItemInternal = CoreMediaItemDataInternal & {

	catalogLoadId: string;
}

/**
 * Media item catalog search result, internal type just for display purposes
 */
export type SearchMediaItemCatalogResultInternal = {

	catalogId: string;
	name: string;
	releaseDate?: Date;
}
