import { MediaItemsStatsFilterInternal, MediaItemsStatsInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * Portion of the internal state with the media items stats information
 */
export type MediaItemsStatsState = {

	/**
	 * The current status (e.g. allows to invalidate, show the loading indicator, etc.)
	 */
	readonly status: MediaItemsStatsStatus;

	/**
	 * The current stats filter. It always exists: "everything" is a filter with no option set
	 */
	readonly filter: MediaItemsStatsFilterInternal;

	/**
	 * The stats of the current category with the current filter, undefined until the first successful fetch
	 */
	readonly stats?: MediaItemsStatsInternal;
};

/**
 * The initial value for the media items stats state
 */
export const mediaItemsStatsStateInitialValue: MediaItemsStatsState = {
	status: 'REQUIRES_FETCH',
	filter: {},
	stats: undefined
};

/**
 * Utility to map the state for persistence
 * @param state the current state
 * @returns the mapped state
 */
export const mapMediaItemsStatsForPersistence = (state: MediaItemsStatsState): MediaItemsStatsState => {
	return {
		...state,
		status: 'REQUIRES_FETCH'
	};
};

/**
 * Utility to tell if a stats filter targets everything, i.e. if the user has not narrowed the stats down at all
 * @param filter the filter to check
 * @returns true if the filter has no option set
 */
export const isEmptyMediaItemsStatsFilter = (filter: MediaItemsStatsFilterInternal): boolean => {
	return !filter.groups && !filter.ownPlatforms;
};

/**
 * The current status (e.g. allows to invalidate, show the loading indicator, etc.)
 */
export type MediaItemsStatsStatus = 'REQUIRES_FETCH' | 'FETCHING' | 'FETCHED' | 'FETCH_FAILED';
