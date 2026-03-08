import { GroupInternal } from 'app/data/models/internal/group';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * Portion of the internal state with the media items list information
 */
export type MediaItemsListState = {
	
	/**
	 * The current status (e.g. allows to invalidate, show the loading indicator, etc.)
	 */
	readonly status: MediaItemsListStatus;
	
	/**
	 * The current mode (e.g. allows to toggle between standard and search mode)
	 */
	readonly mode: MediaItemsListMode;

	/**
	 * The current search term
	 */
	readonly searchTerm?: string;

	/**
	 * The current group whose media items are shown
	 */
	readonly viewGroup?: GroupInternal;

	/**
	 * The current media item filter
	 */
	readonly filter?: MediaItemFilterInternal;

	/**
	 * The current media item order filter
	 */
	readonly sortBy?: MediaItemSortByInternal[];
	
	/**
	 * The list of available media items
	 */
	readonly mediaItems: MediaItemInternal[];

	/**
	 * The currently highlighted (e.g. context menu is open) media item, or undefined if none is highlighted
	 */
	readonly highlightedMediaItem: MediaItemInternal | undefined;
}

/**
 * Portion of the internal state with the media item details information
 */
export type MediaItemDetailsState = {

	/**
	 * The media item data
	 */
	readonly mediaItem?: MediaItemInternal;

	/**
	 * If the currently loaded media item is valid (no validation error occurred)
	 */
	readonly valid: boolean;

	/**
	 * If the currently loaded media item is dirty (one or more fields are different from initial values)
	 */
	readonly dirty: boolean;

	/**
	 * The media item catalog search results
	 */
	readonly catalogSearchResults?: SearchMediaItemCatalogResultInternal[];

	/**
	 * The media item catalog details
	 */
	readonly catalogDetails?: CatalogMediaItemInternal;

	/**
	 * The current status of the media item catalog retrieval process
	 */
	readonly catalogStatus: MediaItemsCatalogStatus;

	/**
	 * The current status of the media item saving process
	 */
	readonly saveStatus: MediaItemSaveStatus;
}

/**
 * The current status (e.g. allows to invalidate, show the loading indicator, etc.)
 */
export type MediaItemsListStatus = 'REQUIRES_FETCH' | 'FETCHING' | 'FETCHED' | 'DELETING' | 'INLINE_UPDATING';

/**
 * The current mode (e.g. allows to toggle between standard and search mode)
 */
export type MediaItemsListMode = 'NORMAL' | 'SEARCH' | 'SET_FILTERS' | 'VIEW_GROUP';

/**
 * The current status of the media item saving process
 */
export type MediaItemSaveStatus = 'IDLE' | 'REQUESTED' | 'REQUIRES_CONFIRMATION' | 'SAVING' | 'SAVED';

/**
 * The current status of the media item catalog retrieval process
 */
export type MediaItemsCatalogStatus = 'IDLE' | 'FETCHING';
