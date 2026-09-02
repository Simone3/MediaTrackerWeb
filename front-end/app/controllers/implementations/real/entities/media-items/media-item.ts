import { ClassType } from 'class-transformer-validator';
import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/main/common/back-end-invoker';
import { MediaItemCatalogController, MediaItemController } from 'app/controllers/interfaces/entities/media-items/media-item';
import { mediaItemsStatsFilterMapper, mediaItemsStatsMapper } from 'app/data/mappers/media-items/media-item';
import { AddMediaItemRequest, AddMediaItemResponse, DeleteMediaItemResponse, FilterMediaItemsRequest, FilterMediaItemsResponse, GetMediaItemFromCatalogResponse, GetMediaItemsStatsRequest, GetMediaItemsStatsResponse, SearchMediaItemCatalogResponse, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { PaginatedResultInternal, PaginationInternal } from 'app/data/models/internal/common';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemsStatsFilterInternal, MediaItemsStatsInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Base class for the media item controllers that query the back-end APIs. The four media types share one route shape exactly, and the
 * request and response bodies differ only by the name of the field that carries the media items: every call is therefore made here once,
 * and subclasses declare their own path segment plus the handful of type-specific models and mappers the calls need
 * @see MediaItemController
 */
export abstract class MediaItemBackEndController<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> implements MediaItemController<TMediaItemInternal, TMediaItemSortByInternal, TMediaItemFilterInternal> {
	/**
	 * The path segment of the media type, e.g. "movies"
	 */
	protected abstract readonly mediaItemPathName: string;

	/**
	 * The response class of the 'filter media items' API for the media type
	 */
	protected abstract readonly filterResponseClass: ClassType<FilterMediaItemsResponse>;

	/**
	 * The response class of the 'search media items' API for the media type
	 */
	protected abstract readonly searchResponseClass: ClassType<SearchMediaItemsResponse>;

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: TMediaItemFilterInternal, sortBy?: TMediaItemSortByInternal[], pagination?: PaginationInternal): Promise<PaginatedResultInternal<TMediaItemInternal>> {
		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: this.buildMediaItemsUrl(userId, categoryId, '/filter'),
			requestBody: this.buildFilterRequest(filter, sortBy, pagination),
			responseBodyClass: this.filterResponseClass
		});

		return this.toPaginatedResult(response);
	}
	
	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string, pagination?: PaginationInternal): Promise<PaginatedResultInternal<TMediaItemInternal>> {
		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: this.buildMediaItemsUrl(userId, categoryId, '/search'),
			requestBody: this.buildSearchRequest(searchTerm, pagination),
			responseBodyClass: this.searchResponseClass
		});

		return this.toPaginatedResult(response);
	}

	/**
	 * @override
	 */
	public async getStats(userId: string, categoryId: string, filter?: MediaItemsStatsFilterInternal): Promise<MediaItemsStatsInternal> {
		const request: GetMediaItemsStatsRequest = {
			filter: filter ? mediaItemsStatsFilterMapper.toExternal(filter) : undefined,

			// The back end groups the completions by year in this time zone: the dates are written here at local midnight, so a completion
			// dated the 1st of January would land in the previous year for anyone east of Greenwich if the server grouped them in UTC
			timezone: dateUtils.getCurrentTimeZone()
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: this.buildMediaItemsUrl(userId, categoryId, '/stats'),
			requestBody: request,
			responseBodyClass: GetMediaItemsStatsResponse
		});

		return mediaItemsStatsMapper.toInternal(response);
	}

	/**
	 * @override
	 */
	public async save(userId: string, categoryId: string, mediaItem: TMediaItemInternal): Promise<void> {
		if(mediaItem.id) {
			await backEndInvoker.invoke({
				method: 'PUT',
				url: this.buildMediaItemUrl(userId, categoryId, mediaItem.id),
				requestBody: this.buildUpdateRequest(mediaItem),
				responseBodyClass: UpdateMediaItemResponse
			});
		}
		else {
			await backEndInvoker.invoke({
				method: 'POST',
				url: this.buildMediaItemsUrl(userId, categoryId),
				requestBody: this.buildAddRequest(mediaItem),
				responseBodyClass: AddMediaItemResponse
			});
		}
	}

	/**
	 * @override
	 */
	public async delete(userId: string, categoryId: string, mediaItemId: string): Promise<void> {
		await backEndInvoker.invoke({
			method: 'DELETE',
			url: this.buildMediaItemUrl(userId, categoryId, mediaItemId),
			responseBodyClass: DeleteMediaItemResponse
		});
	}

	/**
	 * For subclasses, to build the type-specific request body of the 'filter media items' API
	 * @param filter the filter to apply
	 * @param sortBy the order to apply
	 * @param pagination the optional pagination options
	 * @returns the request body
	 */
	protected abstract buildFilterRequest(filter?: TMediaItemFilterInternal, sortBy?: TMediaItemSortByInternal[], pagination?: PaginationInternal): FilterMediaItemsRequest;

	/**
	 * For subclasses, to build the type-specific request body of the 'search media items' API
	 * @param searchTerm the search term
	 * @param pagination the optional pagination options
	 * @returns the request body
	 */
	protected abstract buildSearchRequest(searchTerm: string, pagination?: PaginationInternal): SearchMediaItemsRequest;

	/**
	 * For subclasses, to read and map the media items carried by a 'filter' or 'search' response, which name the field after their own media type
	 * @param response the API response
	 * @returns the media items
	 */
	protected abstract getMediaItemsFromResponse(response: FilterMediaItemsResponse | SearchMediaItemsResponse): TMediaItemInternal[];

	/**
	 * For subclasses, to build the type-specific request body of the 'add media item' API
	 * @param mediaItem the media item to add
	 * @returns the request body
	 */
	protected abstract buildAddRequest(mediaItem: TMediaItemInternal): AddMediaItemRequest;

	/**
	 * For subclasses, to build the type-specific request body of the 'update media item' API
	 * @param mediaItem the media item to update
	 * @returns the request body
	 */
	protected abstract buildUpdateRequest(mediaItem: TMediaItemInternal): UpdateMediaItemRequest;

	/**
	 * Helper to turn a 'filter' or 'search' response into the paginated result the callers expect. Asking for every match makes the back end
	 * answer without a pagination block, and the total then falls back to the number of elements that came back
	 * @param response the API response
	 * @returns the requested page and the total number of matches
	 */
	private toPaginatedResult(response: FilterMediaItemsResponse | SearchMediaItemsResponse): PaginatedResultInternal<TMediaItemInternal> {
		const mediaItems = this.getMediaItemsFromResponse(response);

		return {
			elements: mediaItems,
			totalCount: response.pagination ? response.pagination.totalCount : mediaItems.length
		};
	}

	/**
	 * Helper to build the URL of a media items collection route
	 * @param userId the user
	 * @param categoryId the category
	 * @param pathSuffix the optional path segment after the media type one, e.g. '/filter'
	 * @returns the URL
	 */
	private buildMediaItemsUrl(userId: string, categoryId: string, pathSuffix?: string): string {
		return miscUtils.buildUrl([ config.backEnd.baseUrl, `/users/:userId/categories/:categoryId/${this.mediaItemPathName}${pathSuffix ? pathSuffix : ''}` ], {
			userId: userId,
			categoryId: categoryId
		});
	}

	/**
	 * Helper to build the URL of a single media item route
	 * @param userId the user
	 * @param categoryId the category
	 * @param mediaItemId the media item
	 * @returns the URL
	 */
	private buildMediaItemUrl(userId: string, categoryId: string, mediaItemId: string): string {
		return miscUtils.buildUrl([ config.backEnd.baseUrl, `/users/:userId/categories/:categoryId/${this.mediaItemPathName}/:id` ], {
			userId: userId,
			categoryId: categoryId,
			id: mediaItemId
		});
	}
}

/**
 * Base class for the media item catalog controllers that query the back-end APIs. Just like the user database routes, the two catalog
 * routes differ between the four media types only by their path segment and by the models they carry
 * @see MediaItemCatalogController
 */
export abstract class MediaItemCatalogBackEndController<TSearchMediaItemCatalogResultInternal extends SearchMediaItemCatalogResultInternal, TCatalogMediaItemInternal extends CatalogMediaItemInternal> implements MediaItemCatalogController<TSearchMediaItemCatalogResultInternal, TCatalogMediaItemInternal> {
	/**
	 * The path segment of the media type, e.g. "movies"
	 */
	protected abstract readonly mediaItemPathName: string;

	/**
	 * The response class of the 'search catalog' API for the media type
	 */
	protected abstract readonly catalogSearchResponseClass: ClassType<SearchMediaItemCatalogResponse>;

	/**
	 * The response class of the 'get from catalog' API for the media type
	 */
	protected abstract readonly catalogDetailsResponseClass: ClassType<GetMediaItemFromCatalogResponse>;

	/**
	 * @override
	 */
	public async search(searchTerm: string): Promise<TSearchMediaItemCatalogResultInternal[]> {
		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, `/catalog/${this.mediaItemPathName}/search/:searchTerm` ], {
				searchTerm: searchTerm
			}),
			responseBodyClass: this.catalogSearchResponseClass
		});
		
		return this.getSearchResultsFromResponse(response);
	}

	/**
	 * @override
	 */
	public async getDetails(catalogId: string): Promise<TCatalogMediaItemInternal> {
		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, `/catalog/${this.mediaItemPathName}/:catalogId` ], {
				catalogId: catalogId
			}),
			responseBodyClass: this.catalogDetailsResponseClass
		});
		
		return this.getCatalogDetailsFromResponse(response);
	}

	/**
	 * For subclasses, to map the results carried by a 'search catalog' response
	 * @param response the API response
	 * @returns the catalog search results
	 */
	protected abstract getSearchResultsFromResponse(response: SearchMediaItemCatalogResponse): TSearchMediaItemCatalogResultInternal[];

	/**
	 * For subclasses, to read and map the details carried by a 'get from catalog' response, which names the field after its own media type
	 * @param response the API response
	 * @returns the catalog details
	 */
	protected abstract getCatalogDetailsFromResponse(response: GetMediaItemFromCatalogResponse): TCatalogMediaItemInternal;
}
