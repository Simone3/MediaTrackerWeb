import { Action } from 'redux';
import { SELECT_CATEGORY } from 'app/redux/actions/category/const';
import { COMPLETE_FETCHING_MEDIA_ITEMS_STATS, FAIL_FETCHING_MEDIA_ITEMS_STATS, SET_MEDIA_ITEMS_STATS_FILTER, START_FETCHING_MEDIA_ITEMS_STATS } from 'app/redux/actions/media-item/const';
import { CompleteFetchingMediaItemsStatsAction, SetMediaItemsStatsFilterAction } from 'app/redux/actions/media-item/types';
import { MediaItemsStatsState, mediaItemsStatsStateInitialValue } from 'app/redux/state/media-item-stats';

/**
 * Reducer for the media items stats portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const mediaItemsStats = (state: MediaItemsStatsState = mediaItemsStatsStateInitialValue, action: Action): MediaItemsStatsState => {
	switch(action.type) {
		// When a category is selected, the whole slice is reset: the stats of the previous category say nothing about this one, and
		// neither does the filter, whose groups and own platforms are category-scoped
		case SELECT_CATEGORY: {
			return {
				...mediaItemsStatsStateInitialValue
			};
		}

		// When the app starts fetching the stats, the status changes to show the loading indicator
		case START_FETCHING_MEDIA_ITEMS_STATS: {
			return {
				...state,
				status: 'FETCHING'
			};
		}

		// When the app completes the fetching process, the status is reset and the retrieved stats are saved
		case COMPLETE_FETCHING_MEDIA_ITEMS_STATS: {
			const completeFetchingMediaItemsStatsAction = action as CompleteFetchingMediaItemsStatsAction;

			return {
				...state,
				status: 'FETCHED',
				stats: completeFetchingMediaItemsStatsAction.stats
			};
		}

		// When the fetching process fails, the last known stats are kept on screen under the retry card
		case FAIL_FETCHING_MEDIA_ITEMS_STATS: {
			return {
				...state,
				status: 'FETCH_FAILED'
			};
		}

		// When the filter changes, the stats it produced no longer answer the question being asked, so they are reloaded
		case SET_MEDIA_ITEMS_STATS_FILTER: {
			const setMediaItemsStatsFilterAction = action as SetMediaItemsStatsFilterAction;

			return {
				...state,
				status: 'REQUIRES_FETCH',
				filter: setMediaItemsStatsFilterAction.filter
			};
		}

		default:
			return state;
	}
};
