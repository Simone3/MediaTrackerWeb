import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Portion of the internal state with the TV show seasons list information
 */
export type TvShowSeasonsListState = {

	/**
	 * The list of available TV show seasons
	 */
	readonly tvShowSeasons: TvShowSeasonInternal[];

	/**
	 * The timestamp when the user completed handling the TV show seasons
	 */
	readonly completeHandlingTimestamp: Date | undefined;

	/**
	 * The currently highlighted (e.g. context menu is open) TV show season, or undefined if none is highlighted
	 */
	readonly highlightedTvShowSeason: TvShowSeasonInternal | undefined;
}

/**
 * Portion of the internal state with the TV show season details information
 */
export type TvShowSeasonDetailsState = {

	/**
	 * The TV show season form mode
	 */
	readonly formMode: TvShowSeasonDetailsFormMode;

	/**
	 * The TV show season data
	 */
	readonly tvShowSeason?: TvShowSeasonInternal;

	/**
	 * If the currently loaded TV show season is valid (no validation error occurred)
	 */
	readonly valid: boolean;

	/**
	 * If the currently loaded TV show season is dirty (one or more fields are different from initial values)
	 */
	readonly dirty: boolean;

	/**
	 * The current status of the TV show season saving process
	 */
	readonly saveStatus: TvShowSeasonSaveStatus;
}

/**
 * The TV show season form mode
 */
export type TvShowSeasonDetailsFormMode = 'NEW' | 'EXISTING';

/**
 * The current status of the TV show season saving process
 */
export type TvShowSeasonSaveStatus = 'IDLE' | 'REQUESTED' | 'SAVED';
