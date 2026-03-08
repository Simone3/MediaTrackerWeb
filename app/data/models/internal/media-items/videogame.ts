import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { OptionalToUndefined } from 'app/utilities/helper-types';

/**
 * Util type to extract common fields to both videogame entities and catalog entries
 */
type CoreVideogameDataInternal = {

	developers?: string[];
	publishers?: string[];
	platforms?: string[];
};

/**
 * Model for a videogame, internal type just for display purposes
 */
export type VideogameInternal = MediaItemInternal & CoreVideogameDataInternal & {
	
	averageLengthHours?: number;
}

/**
 * Videogame filtering options, internal type just for display purposes
 */
export type VideogameFilterInternal = MediaItemFilterInternal & {

}

/**
 * Values for videogame ordering options, internal type just for display purposes
 */
export type VideogameSortFieldInternal = MediaItemSortFieldInternal | 'DEVELOPER';

/**
 * Videogames sort by options, internal type just for display purposes
 */
export type VideogameSortByInternal = MediaItemSortByInternal & {

	field: VideogameSortFieldInternal;
}

/**
 * Model for a catalog videogame, internal type just for display purposes
 */
export type CatalogVideogameInternal = CatalogMediaItemInternal & CoreVideogameDataInternal & {

};

/**
 * Videogame catalog search result, internal type just for display purposes
 */
export type SearchVideogameCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

/**
 * The default initial videogame, internal type just for display purposes
 */
export const DEFAULT_VIDEOGAME: VideogameInternal = {
	id: '',
	name: '',
	mediaType: 'VIDEOGAME',
	status: 'NEW',
	importance: '400'
};

/**
 * The default videogame catalog details (with all fields set), internal type just for display purposes
 */
export const DEFAULT_CATALOG_VIDEOGAME: OptionalToUndefined<CatalogVideogameInternal> = {
	catalogId: undefined,
	catalogLoadId: 'init',
	name: '',
	description: undefined,
	genres: undefined,
	imageUrl: undefined,
	releaseDate: undefined,
	developers: undefined,
	platforms: undefined,
	publishers: undefined
};

