import { LOAD_MEDIA_ITEM_DETAILS, LOAD_NEW_MEDIA_ITEM_DETAILS } from 'app/redux/actions/media-item/const';
import { COMPLETE_DELETING_TV_SHOW_SEASON, COMPLETE_INLINE_UPDATING_TV_SHOW_SEASON, COMPLETE_SAVING_TV_SHOW_SEASON, COMPLETE_TV_SHOW_SEASONS_HANDLING, HIGHLIGHT_TV_SHOW_SEASON, REMOVE_TV_SHOW_SEASON_HIGHLIGHT, START_TV_SHOW_SEASONS_HANDLING } from 'app/redux/actions/tv-show-season/const';
import { CompleteDeletingTvShowSeasonAction, CompleteInlineUpdatingTvShowSeasonAction, CompleteSavingTvShowSeasonAction, HighlightTvShowSeasonAction, StartTvShowSeasonsHandlingAction } from 'app/redux/actions/tv-show-season/types';
import { TvShowSeasonsListState } from 'app/redux/state/tv-show-season';
import { Action } from 'redux';

/**
 * The initial state for the TV show seasons list
 */
const initialState: TvShowSeasonsListState = {
	tvShowSeasons: [],
	completeHandlingTimestamp: undefined,
	highlightedTvShowSeason: undefined
};

/**
 * Reducer for the TV show seasons list portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const tvShowSeasonsList = (state: TvShowSeasonsListState = initialState, action: Action): TvShowSeasonsListState => {
	
	switch(action.type) {

		// When the media item details page is initialized, the current seasons list is reset
		case LOAD_NEW_MEDIA_ITEM_DETAILS:
		case LOAD_MEDIA_ITEM_DETAILS: {

			return {
				...initialState
			};
		}
	
		// When the TV show seasons are loaded, the given list is saved in the state
		case START_TV_SHOW_SEASONS_HANDLING:
		case COMPLETE_SAVING_TV_SHOW_SEASON:
		case COMPLETE_DELETING_TV_SHOW_SEASON:
		case COMPLETE_INLINE_UPDATING_TV_SHOW_SEASON: {

			const loadTvShowSeasonsAction = action as StartTvShowSeasonsHandlingAction | CompleteSavingTvShowSeasonAction | CompleteDeletingTvShowSeasonAction | CompleteInlineUpdatingTvShowSeasonAction;
			
			return {
				...state,
				tvShowSeasons: loadTvShowSeasonsAction.tvShowSeasons
			};
		}

		// When the user is done handling the TV show seasons, the timestamp is saved in the state
		case COMPLETE_TV_SHOW_SEASONS_HANDLING: {

			return {
				...state,
				completeHandlingTimestamp: new Date()
			};
		}
		
		// When a TV show season is highlighted (e.g. to open the context menu), the corresponding state field is set
		case HIGHLIGHT_TV_SHOW_SEASON: {

			const highlightTvShowSeasonAction = action as HighlightTvShowSeasonAction;

			return {
				...state,
				highlightedTvShowSeason: highlightTvShowSeasonAction.tvShowSeason
			};
		}

		// When a TV show season is no longer highlighted (e.g. to close the context menu), the corresponding state field is reset
		case REMOVE_TV_SHOW_SEASON_HIGHLIGHT: {

			return {
				...state,
				highlightedTvShowSeason: undefined
			};
		}

		default:
			return state;
	}
};
