import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { Action } from 'redux';

/**
 * The start handling TV show seasons action
 */
export type StartTvShowSeasonsHandlingAction = Action & {
	
	tvShowSeasons: TvShowSeasonInternal[];
};

/**
 * The complete handling TV show seasons action
 */
export type CompleteTvShowSeasonsHandlingAction = Action & {
	
};

/**
 * The load new TV show season action
 */
export type LoadNewTvShowSeasonDetailsAction = Action & {
	
};

/**
 * The load existing TV show season action
 */
export type LoadTvShowSeasonDetailsAction = Action & {
	
	tvShowSeason: TvShowSeasonInternal;
};

/**
 * The request TV show season save action
 */
export type RequestTvShowSeasonSave = Action & {
	
};

/**
 * The save TV show season action
 */
export type SaveTvShowSeasonAction = Action & {
	
	tvShowSeason: TvShowSeasonInternal;
};

/**
 * The set TV show season form status action
 */
export type SetTvShowSeasonFormStatusAction = Action & {
	
	valid: boolean;
	dirty: boolean;
};

/**
 * The complete saving TV show season action
 */
export type CompleteSavingTvShowSeasonAction = Action & {
	
	tvShowSeasons: TvShowSeasonInternal[];
};

/**
 * The fail saving TV show season action
 */
export type FailSavingTvShowSeasonAction = Action & {
	
};

/**
 * The delete TV show season action
 */
export type DeleteTvShowSeasonAction = Action & {
	
	tvShowSeason: TvShowSeasonInternal;
};

/**
 * The complete deleting TV show season action
 */
export type CompleteDeletingTvShowSeasonAction = Action & {
	
	tvShowSeasons: TvShowSeasonInternal[];
};

/**
 * The inline update TV show season action
 */
export type InlineUpdateTvShowSeasonAction = Action & {
	
	tvShowSeason: TvShowSeasonInternal;
};

/**
 * The complete inline updating TV show season action
 */
export type CompleteInlineUpdatingTvShowSeasonAction = Action & {
	
	tvShowSeasons: TvShowSeasonInternal[];
};

/**
 * The highlight TV show season action
 */
export type HighlightTvShowSeasonAction = Action & {
	
	tvShowSeason: TvShowSeasonInternal;
};

/**
 * The remove TV show season highlight action
 */
export type RemoveTvShowSeasonHighlightAction = Action & {
	
};
