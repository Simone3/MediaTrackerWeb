import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { COMPLETE_DELETING_TV_SHOW_SEASON, COMPLETE_INLINE_UPDATING_TV_SHOW_SEASON, COMPLETE_SAVING_TV_SHOW_SEASON, COMPLETE_TV_SHOW_SEASONS_HANDLING, DELETE_TV_SHOW_SEASON, FAIL_SAVING_TV_SHOW_SEASON, HIGHLIGHT_TV_SHOW_SEASON, INLINE_UPDATE_TV_SHOW_SEASON, LOAD_NEW_TV_SHOW_SEASON_DETAILS, LOAD_TV_SHOW_SEASON_DETAILS, REMOVE_TV_SHOW_SEASON_HIGHLIGHT, REQUEST_TV_SHOW_SEASON_SAVE, SAVE_TV_SHOW_SEASON, SET_TV_SHOW_SEASON_FORM_STATUS, START_TV_SHOW_SEASONS_HANDLING } from './const';
import { CompleteDeletingTvShowSeasonAction, CompleteInlineUpdatingTvShowSeasonAction, CompleteSavingTvShowSeasonAction, CompleteTvShowSeasonsHandlingAction, DeleteTvShowSeasonAction, FailSavingTvShowSeasonAction, HighlightTvShowSeasonAction, InlineUpdateTvShowSeasonAction, LoadNewTvShowSeasonDetailsAction, LoadTvShowSeasonDetailsAction, RemoveTvShowSeasonHighlightAction, RequestTvShowSeasonSave, SaveTvShowSeasonAction, SetTvShowSeasonFormStatusAction, StartTvShowSeasonsHandlingAction } from './types';

/**
 * Generator for the start handling TV show seasons action, which saves in the state the initial list of seasons
 * @param tvShowSeasons the TV show seasons, possibly an empty array
 * @returns the action
 */
export const startTvShowSeasonsHandling = (tvShowSeasons: TvShowSeasonInternal[]): StartTvShowSeasonsHandlingAction => {
	
	return {
		type: START_TV_SHOW_SEASONS_HANDLING,
		tvShowSeasons: tvShowSeasons
	};
};

/**
 * Generator for the complete handling TV show seasons action, which saves the updated list of seasons in the media item form
 * @returns the action
 */
export const completeTvShowSeasonsHandling = (): CompleteTvShowSeasonsHandlingAction => {
	
	return {
		type: COMPLETE_TV_SHOW_SEASONS_HANDLING
	};
};

/**
 * Generator for the load new TV show season action, which resets the TV show season details state to the initial values
 * @returns the action
 */
export const loadNewTvShowSeasonDetails = (): LoadNewTvShowSeasonDetailsAction => {
	
	return {
		type: LOAD_NEW_TV_SHOW_SEASON_DETAILS
	};
};

/**
 * Generator for the load existing TV show season action, which sets the TV show season details state
 * @param tvShowSeason the TV show season data
 * @returns the action
 */
export const loadTvShowSeasonDetails = (tvShowSeason: TvShowSeasonInternal): LoadTvShowSeasonDetailsAction => {
	
	return {
		type: LOAD_TV_SHOW_SEASON_DETAILS,
		tvShowSeason: tvShowSeason
	};
};

/**
 * Generator for the TV show season save request action, which notifies the form to submit its data
 * @returns the action
 */
export const requestTvShowSeasonSave = (): RequestTvShowSeasonSave => {
	
	return {
		type: REQUEST_TV_SHOW_SEASON_SAVE
	};
};

/**
 * Generator for the TV show season save action, which adds a new season to the state
 * @param tvShowSeason the TV show season data
 * @returns the action
 */
export const saveTvShowSeason = (tvShowSeason: TvShowSeasonInternal): SaveTvShowSeasonAction => {
	
	return {
		type: SAVE_TV_SHOW_SEASON,
		tvShowSeason: tvShowSeason
	};
};

/**
 * Generator for the set TV show season form status, which sets the current status of the TV show season details form
 * @param valid true if the form is currently valid (no validation errors)
 * @param dirty true if the form is currently dirty (one or more fields changed)
 * @returns the action
 */
export const setTvShowSeasonFormStatus = (valid: boolean, dirty: boolean): SetTvShowSeasonFormStatusAction => {
	
	return {
		type: SET_TV_SHOW_SEASON_FORM_STATUS,
		valid: valid,
		dirty: dirty
	};
};

/**
 * Generator for the complete saving TV show season action, which updates the list of seasons and exits the season form
 * @param tvShowSeasons the new list of seasons
 * @returns the action
 */
export const completeSavingTvShowSeason = (tvShowSeasons: TvShowSeasonInternal[]): CompleteSavingTvShowSeasonAction => {
	
	return {
		type: COMPLETE_SAVING_TV_SHOW_SEASON,
		tvShowSeasons: tvShowSeasons
	};
};

/**
 * Generator for the fail saving TV show season action, which marks the unsuccessful end of the season saving operation
 * @returns the action
 */
export const failSavingTvShowSeason = (): FailSavingTvShowSeasonAction => {
	
	return {
		type: FAIL_SAVING_TV_SHOW_SEASON
	};
};

/**
 * Generator for the delete TV show season action, which removes a season from the state
 * @param tvShowSeason the seasons data
 * @returns the action
 */
export const deleteTvShowSeason = (tvShowSeason: TvShowSeasonInternal): DeleteTvShowSeasonAction => {
	
	return {
		type: DELETE_TV_SHOW_SEASON,
		tvShowSeason: tvShowSeason
	};
};

/**
 * Generator for the complete deleting TV show season action, which updates the list of seasons and exits the season form
 * @param tvShowSeasons the new list of seasons
 * @returns the action
 */
export const completeDeletingTvShowSeason = (tvShowSeasons: TvShowSeasonInternal[]): CompleteDeletingTvShowSeasonAction => {
	
	return {
		type: COMPLETE_DELETING_TV_SHOW_SEASON,
		tvShowSeasons: tvShowSeasons
	};
};

/**
 * Generator for the inline update TV show season action, which removes a season from the state
 * @param tvShowSeason the seasons data
 * @returns the action
 */
export const inlineUpdateTvShowSeason = (tvShowSeason: TvShowSeasonInternal): InlineUpdateTvShowSeasonAction => {
	
	return {
		type: INLINE_UPDATE_TV_SHOW_SEASON,
		tvShowSeason: tvShowSeason
	};
};

/**
 * Generator for the complete inline updating TV show season action, which updates the list of seasons
 * @param tvShowSeasons the new list of seasons
 * @returns the action
 */
export const completeInlineUpdatingTvShowSeason = (tvShowSeasons: TvShowSeasonInternal[]): CompleteInlineUpdatingTvShowSeasonAction => {
	
	return {
		type: COMPLETE_INLINE_UPDATING_TV_SHOW_SEASON,
		tvShowSeasons: tvShowSeasons
	};
};

/**
 * Generator for the highlight TV show season action, which marks a season as highlighted
 * @param tvShowSeason the TV show season
 * @returns the action
 */
export const highlightTvShowSeason = (tvShowSeason: TvShowSeasonInternal): HighlightTvShowSeasonAction => {
	
	return {
		type: HIGHLIGHT_TV_SHOW_SEASON,
		tvShowSeason: tvShowSeason
	};
};

/**
 * Generator for the remove TV show season highlight action, which removes any highlighted season
 * @returns the action
 */
export const removeTvShowSeasonHighlight = (): RemoveTvShowSeasonHighlightAction => {
	
	return {
		type: REMOVE_TV_SHOW_SEASON_HIGHLIGHT
	};
};

