import { DEFAULT_TV_SHOW_SEASON } from 'app/data/models/internal/media-items/tv-show';
import { COMPLETE_SAVING_TV_SHOW_SEASON, FAIL_SAVING_TV_SHOW_SEASON, LOAD_NEW_TV_SHOW_SEASON_DETAILS, LOAD_TV_SHOW_SEASON_DETAILS, REQUEST_TV_SHOW_SEASON_SAVE, SET_TV_SHOW_SEASON_FORM_STATUS } from 'app/redux/actions/tv-show-season/const';
import { LoadTvShowSeasonDetailsAction, SetTvShowSeasonFormStatusAction } from 'app/redux/actions/tv-show-season/types';
import { TvShowSeasonDetailsState } from 'app/redux/state/tv-show-season';
import { Action } from 'redux';

/**
 * The initial state for the tvShowSeason details
 */
const initialState: TvShowSeasonDetailsState = {
	formMode: 'NEW',
	saveStatus: 'IDLE',
	tvShowSeason: undefined,
	valid: false,
	dirty: false
};

/**
 * Reducer for the tvShowSeason details portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const tvShowSeasonDetails = (state: TvShowSeasonDetailsState = initialState, action: Action): TvShowSeasonDetailsState => {
	
	switch(action.type) {

		// When the details page is started with a new tvShowSeason, the status is reset and the default tvShowSeason is loaded
		case LOAD_NEW_TV_SHOW_SEASON_DETAILS: {

			return {
				...state,
				formMode: 'NEW',
				saveStatus: 'IDLE',
				tvShowSeason: DEFAULT_TV_SHOW_SEASON
			};
		}
	
		// When the details page is started with an existing tvShowSeason, the status is reset and the given tvShowSeason is loaded
		case LOAD_TV_SHOW_SEASON_DETAILS: {

			const loadTvShowSeasonAction = action as LoadTvShowSeasonDetailsAction;
			
			return {
				...state,
				formMode: 'EXISTING',
				saveStatus: 'IDLE',
				tvShowSeason: loadTvShowSeasonAction.tvShowSeason
			};
		}
	
		// When the TV show season save is requested, the status changes (e.g. allows header save button to notify the form about the request)
		case REQUEST_TV_SHOW_SEASON_SAVE: {

			return {
				...state,
				saveStatus: 'REQUESTED'
			};
		}
	
		// When the TV show season is saved, the status changes
		case COMPLETE_SAVING_TV_SHOW_SEASON: {

			return {
				...state,
				saveStatus: 'SAVED'
			};
		}

		// When the app fails to save a TV show season, the status is reset (an error is shown by the global handler)
		case FAIL_SAVING_TV_SHOW_SEASON: {

			return {
				...state,
				saveStatus: 'IDLE'
			};
		}

		// When the form status changes, the corresponding state fields are set
		case SET_TV_SHOW_SEASON_FORM_STATUS: {

			const setTvShowSeasonFormStatusAction = action as SetTvShowSeasonFormStatusAction;
			
			return {
				...state,
				valid: setTvShowSeasonFormStatusAction.valid,
				dirty: setTvShowSeasonFormStatusAction.dirty
			};
		}

		default:
			return state;
	}
};
