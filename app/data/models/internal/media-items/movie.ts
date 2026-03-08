import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { OptionalToUndefined } from 'app/utilities/helper-types';

/**
 * Util type to extract common fields to both movie entities and catalog entries
 */
type CoreMovieDataInternal = {

	directors?: string[];
	durationMinutes?: number;
};

/**
 * A movie, internal type just for display purposes
 */
export type MovieInternal = MediaItemInternal & CoreMovieDataInternal & {

}

/**
 * A filter for movies, internal type just for display purposes
 */
export type MovieFilterInternal = MediaItemFilterInternal & {

}

/**
 * Sort fields for movies, internal type just for display purposes
 */
export type MovieSortFieldInternal = MediaItemSortFieldInternal | 'DIRECTOR';

/**
 * A sort by filter for movies, internal type just for display purposes
 */
export type MovieSortByInternal = MediaItemSortByInternal & {

	field: MovieSortFieldInternal;
}

/**
 * Model for a catalog movie, internal type just for display purposes
 */
export type CatalogMovieInternal = CatalogMediaItemInternal & CoreMovieDataInternal & {

};

/**
 * Movie catalog search result, internal type just for display purposes
 */
export type SearchMovieCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

/**
 * The default initial videogame, internal type just for display purposes
 */
export const DEFAULT_MOVIE: MovieInternal = {
	id: '',
	name: '',
	mediaType: 'MOVIE',
	status: 'NEW',
	importance: '400'
};

/**
 * The default movie catalog details (with all fields set), internal type just for display purposes
 */
export const DEFAULT_CATALOG_MOVIE: OptionalToUndefined<CatalogMovieInternal> = {
	catalogId: undefined,
	catalogLoadId: 'init',
	name: '',
	description: undefined,
	directors: undefined,
	durationMinutes: undefined,
	genres: undefined,
	imageUrl: undefined,
	releaseDate: undefined
};
