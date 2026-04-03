import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * The data controller for generic media items: provides methods to select, save and delete media items from the user database
 */
export interface MediaItemController<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> {

	/**
	 * Filters and orders the media items of a category
	 * @param userId the user
	 * @param categoryId the category
	 * @param filter the filter to apply
	 * @param sortBy the order to apply
	 * @returns the list of media items, as a promise
	 */
	filter(userId: string, categoryId: string, filter?: TMediaItemFilterInternal, sortBy?: TMediaItemSortByInternal[]): Promise<TMediaItemInternal[]>;
	
	/**
	 * Searches the media items of a category
	 * @param userId the user
	 * @param categoryId the category
	 * @param searchTerm the search term
	 * @returns the list of media items, as a promise
	 */
	search(userId: string, categoryId: string, searchTerm: string): Promise<TMediaItemInternal[]>;

	/**
	 * Saves a media item into the given category, adding it if the ID is not specified or updating it otherwise
	 * @param userId the user
	 * @param categoryId the category
	 * @param mediaItem the media item
	 * @returns a void promise
	 */
	save(userId: string, categoryId: string, mediaItem: TMediaItemInternal): Promise<void>;

	/**
	 * Deletes a media item from the given category
	 * @param userId the user
	 * @param categoryId the category
	 * @param mediaItemId the media item
	 * @returns a void promise
	 */
	delete(userId: string, categoryId: string, mediaItemId: string): Promise<void>;
}

/**
 * The catalog controller for generic media items: provides methods to query the global catalog
 */
export interface MediaItemCatalogController<TSearchMediaItemCatalogResultInternal extends SearchMediaItemCatalogResultInternal, TCatalogMediaItemInternal extends CatalogMediaItemInternal> {

	/**
	 * Searches the media item catalog
	 * @param searchTerm the search term
	 * @returns the list of catalog matches, as a promise
	 */
	search(searchTerm: string): Promise<TSearchMediaItemCatalogResultInternal[]>;
	
	/**
	 * Gets the details of a specific catalog item
	 * @param catalogId the catalog ID
	 * @returns the catalog details
	 */
	getDetails(catalogId: string): Promise<TCatalogMediaItemInternal>;
}

/**
 * The definitions controller for generic media items: provides methods that define default values or extract common values from media items
 */
export interface MediaItemDefinitionsController<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> {

	/**
	 * Getter for the default media item filter option
	 * @returns the filter
	 */
	getDefaultFilter(): TMediaItemFilterInternal;

	/**
	 * Getter for the default media item sort option
	 * @returns the sort by
	 */
	getDefaultSortBy(): TMediaItemSortByInternal[];

	/**
	 * Getter for the "view group" media item sort option
	 * @returns the sort by
	 */
	getViewGroupSortBy(): TMediaItemSortByInternal[];

	/**
	 * Extracts the creator (e.g. author for books) names from a media item
	 * @param mediaItem the media item
	 * @returns the author names
	 */
	getCreatorNames(mediaItem: TMediaItemInternal): string[] | undefined;
	
	/**
	 * Extracts the duration (e.g. number of pages for books) from a media item
	 * @param mediaItem the media item
	 * @returns the duration value
	 */
	getDurationValue(mediaItem: TMediaItemInternal): number | undefined;

	/**
	 * Defines the default initial values of a media item
	 */
	getDefaultMediaItem(): TMediaItemInternal;
}
