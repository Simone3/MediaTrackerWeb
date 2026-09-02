import { MediaItemBackEndController, MediaItemCatalogBackEndController } from 'app/controllers/implementations/real/entities/media-items/media-item';
import { TvShowCatalogController, TvShowController } from 'app/controllers/interfaces/entities/media-items/tv-show';
import { paginationMapper } from 'app/data/mappers/common';
import { tvShowCatalogDetailsMapper, tvShowCatalogSearchMapper, tvShowFilterMapper, tvShowMapper, tvShowSortMapper } from 'app/data/mappers/media-items/tv-show';
import { AddTvShowRequest, FilterTvShowsRequest, FilterTvShowsResponse, GetTvShowFromCatalogResponse, SearchTvShowCatalogResponse, SearchTvShowsRequest, SearchTvShowsResponse, UpdateTvShowRequest } from 'app/data/models/api/media-items/tv-show';
import { PaginationInternal } from 'app/data/models/internal/common';
import { CatalogTvShowInternal, SearchTvShowCatalogResultInternal, TvShowFilterInternal, TvShowInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Implementation of the TvShowController that queries the back-end APIs
 * @see TvShowController
 */
export class TvShowBackEndController extends MediaItemBackEndController<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal> implements TvShowController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'tv-shows';

	/**
	 * @override
	 */
	protected readonly filterResponseClass = FilterTvShowsResponse;

	/**
	 * @override
	 */
	protected readonly searchResponseClass = SearchTvShowsResponse;

	/**
	 * @override
	 */
	protected buildFilterRequest(filter?: TvShowFilterInternal, sortBy?: TvShowSortByInternal[], pagination?: PaginationInternal): FilterTvShowsRequest {
		return {
			filter: filter ? tvShowFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? tvShowSortMapper.toExternalList(sortBy) : undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};
	}

	/**
	 * @override
	 */
	protected buildSearchRequest(searchTerm: string, pagination?: PaginationInternal): SearchTvShowsRequest {
		return {
			searchTerm: searchTerm,
			filter: undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};
	}

	/**
	 * @override
	 */
	protected getMediaItemsFromResponse(response: FilterTvShowsResponse | SearchTvShowsResponse): TvShowInternal[] {
		return tvShowMapper.toInternalList(response.tvShows);
	}

	/**
	 * @override
	 */
	protected buildAddRequest(tvShow: TvShowInternal): AddTvShowRequest {
		return {
			newTvShow: tvShowMapper.toExternal(tvShow)
		};
	}

	/**
	 * @override
	 */
	protected buildUpdateRequest(tvShow: TvShowInternal): UpdateTvShowRequest {
		return {
			tvShow: tvShowMapper.toExternal(tvShow)
		};
	}
}

/**
 * Implementation of the TvShowCatalogController that queries the back-end APIs
 * @see TvShowCatalogController
 */
export class TvShowCatalogBackEndController extends MediaItemCatalogBackEndController<SearchTvShowCatalogResultInternal, CatalogTvShowInternal> implements TvShowCatalogController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'tv-shows';

	/**
	 * @override
	 */
	protected readonly catalogSearchResponseClass = SearchTvShowCatalogResponse;

	/**
	 * @override
	 */
	protected readonly catalogDetailsResponseClass = GetTvShowFromCatalogResponse;

	/**
	 * @override
	 */
	protected getSearchResultsFromResponse(response: SearchTvShowCatalogResponse): SearchTvShowCatalogResultInternal[] {
		return tvShowCatalogSearchMapper.toInternalList(response.searchResults);
	}

	/**
	 * @override
	 */
	protected getCatalogDetailsFromResponse(response: GetTvShowFromCatalogResponse): CatalogTvShowInternal {
		return tvShowCatalogDetailsMapper.toInternal(response.catalogTvShow);
	}
}
