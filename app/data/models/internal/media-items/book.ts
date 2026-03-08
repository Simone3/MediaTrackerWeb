import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { OptionalToUndefined } from 'app/utilities/helper-types';

/**
 * Util type to extract common fields to both book entities and catalog entries
 */
type CoreBookDataInternal = {

	authors?: string[];
	pagesNumber?: number;
};

/**
 * Model for a book, internal type just for display purposes
 */
export type BookInternal = MediaItemInternal & CoreBookDataInternal & {

}

/**
 * Book filtering options, internal type just for display purposes
 */
export type BookFilterInternal = MediaItemFilterInternal & {

}

/**
 * Values for book ordering options, internal type just for display purposes
 */
export type BookSortFieldInternal = MediaItemSortFieldInternal | 'AUTHOR';

/**
 * Books sort by options, internal type just for display purposes
 */
export type BookSortByInternal = MediaItemSortByInternal & {

	field: BookSortFieldInternal;
}

/**
 * Model for a catalog book, internal type just for display purposes
 */
export type CatalogBookInternal = CatalogMediaItemInternal & CoreBookDataInternal & {

};

/**
 * Book catalog search result, internal type just for display purposes
 */
export type SearchBookCatalogResultInternal = SearchMediaItemCatalogResultInternal & {

};

/**
 * The default initial book, internal type just for display purposes
 */
export const DEFAULT_BOOK: BookInternal = {
	id: '',
	name: '',
	mediaType: 'BOOK',
	status: 'NEW',
	importance: '400'
};

/**
 * The default book catalog details (with all fields set), internal type just for display purposes
 */
export const DEFAULT_CATALOG_BOOK: OptionalToUndefined<CatalogBookInternal> = {
	catalogId: undefined,
	catalogLoadId: 'init',
	name: '',
	description: undefined,
	authors: undefined,
	pagesNumber: undefined,
	genres: undefined,
	imageUrl: undefined,
	releaseDate: undefined
};
