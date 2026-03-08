import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { OptionalToUndefined } from 'app/utilities/helper-types';

/**
 * Util type to extract common fields to both TV show entities and catalog entries
 */
type CoreTvShowDataInternal = {

	creators?: string[];
	averageEpisodeRuntimeMinutes?: number;
	inProduction?: boolean;
	nextEpisodeAirDate?: Date;
};

/**
 * Model for a TV Show season, internal type just for display purposes
 */
export type TvShowSeasonInternal = {

	number: number;
	episodesNumber?: number;
	watchedEpisodesNumber?: number;
}

/**
 * Model for a TV Show, internal type just for display purposes
 */
export type TvShowInternal = MediaItemInternal & CoreTvShowDataInternal & {

	seasons?: TvShowSeasonInternal[];
}

/**
 * TV Show filtering options, internal type just for display purposes
 */
export type TvShowFilterInternal = MediaItemFilterInternal & {

}

/**
 * Values for TV show ordering options, internal type just for display purposes
 */
export type TvShowSortFieldInternal = MediaItemSortFieldInternal | 'CREATOR';

/**
 * TV Show sort by options, internal type just for display purposes
 */
export type TvShowSortByInternal = MediaItemSortByInternal & {

	field: TvShowSortFieldInternal;
}

/**
 * Model for a catalog TV Show season, internal type just for display purposes
 */
export type CatalogTvShowSeasonInternal = {

	number: number;
	episodesNumber?: number;
}

/**
 * Model for a catalog TV Show, internal type just for display purposes
 */
export type CatalogTvShowInternal = CatalogMediaItemInternal & CoreTvShowDataInternal & {
	
	seasons?: CatalogTvShowSeasonInternal[];
};

/**
 * TV Show catalog search result, internal type just for display purposes
 */
export type SearchTvShowCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

/**
 * The default initial TV show, internal type just for display purposes
 */
export const DEFAULT_TV_SHOW: TvShowInternal = {
	id: '',
	name: '',
	mediaType: 'TV_SHOW',
	status: 'NEW',
	importance: '400'
};

/**
 * The default initial TV show season, internal type just for display purposes
 */
export const DEFAULT_TV_SHOW_SEASON: TvShowSeasonInternal = {
	number: undefined as unknown as number,
	episodesNumber: undefined,
	watchedEpisodesNumber: undefined
};

/**
 * The default TV show catalog details (with all fields set), internal type just for display purposes
 */
export const DEFAULT_CATALOG_TV_SHOW: OptionalToUndefined<CatalogTvShowInternal> = {
	catalogId: undefined,
	catalogLoadId: 'init',
	name: '',
	description: undefined,
	genres: undefined,
	imageUrl: undefined,
	releaseDate: undefined,
	averageEpisodeRuntimeMinutes: undefined,
	creators: undefined,
	inProduction: undefined,
	nextEpisodeAirDate: undefined,
	seasons: undefined
};

/**
 * Helper to compare two TV show seasons
 * @param first the first season
 * @param second the second season
 * @returns negative, 0 or positive value based on comparison
 */
export const compareTvShowSeasons = (first: TvShowSeasonInternal, second: TvShowSeasonInternal): number => {

	if(first.number < second.number) {

		return -1;
	}
	else if(first.number > second.number) {

		return 1;
	}
	else {
		
		return 0;
	}
};
