import { MediaItemBackEndController, MediaItemCatalogBackEndController } from 'app/controllers/implementations/real/entities/media-items/media-item';
import { VideogameCatalogController, VideogameController } from 'app/controllers/interfaces/entities/media-items/videogame';
import { paginationMapper } from 'app/data/mappers/common';
import { videogameCatalogDetailsMapper, videogameCatalogSearchMapper, videogameFilterMapper, videogameMapper, videogameSortMapper } from 'app/data/mappers/media-items/videogame';
import { AddVideogameRequest, FilterVideogamesRequest, FilterVideogamesResponse, GetVideogameFromCatalogResponse, SearchVideogameCatalogResponse, SearchVideogamesRequest, SearchVideogamesResponse, UpdateVideogameRequest } from 'app/data/models/api/media-items/videogame';
import { PaginationInternal } from 'app/data/models/internal/common';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal, VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';

/**
 * Implementation of the VideogameController that queries the back-end APIs
 * @see VideogameController
 */
export class VideogameBackEndController extends MediaItemBackEndController<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal> implements VideogameController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'videogames';

	/**
	 * @override
	 */
	protected readonly filterResponseClass = FilterVideogamesResponse;

	/**
	 * @override
	 */
	protected readonly searchResponseClass = SearchVideogamesResponse;

	/**
	 * @override
	 */
	protected buildFilterRequest(filter?: VideogameFilterInternal, sortBy?: VideogameSortByInternal[], pagination?: PaginationInternal): FilterVideogamesRequest {
		return {
			filter: filter ? videogameFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? videogameSortMapper.toExternalList(sortBy) : undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};
	}

	/**
	 * @override
	 */
	protected buildSearchRequest(searchTerm: string, pagination?: PaginationInternal): SearchVideogamesRequest {
		return {
			searchTerm: searchTerm,
			filter: undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};
	}

	/**
	 * @override
	 */
	protected getMediaItemsFromResponse(response: FilterVideogamesResponse | SearchVideogamesResponse): VideogameInternal[] {
		return videogameMapper.toInternalList(response.videogames);
	}

	/**
	 * @override
	 */
	protected buildAddRequest(videogame: VideogameInternal): AddVideogameRequest {
		return {
			newVideogame: videogameMapper.toExternal(videogame)
		};
	}

	/**
	 * @override
	 */
	protected buildUpdateRequest(videogame: VideogameInternal): UpdateVideogameRequest {
		return {
			videogame: videogameMapper.toExternal(videogame)
		};
	}
}

/**
 * Implementation of the VideogameCatalogController that queries the back-end APIs
 * @see VideogameCatalogController
 */
export class VideogameCatalogBackEndController extends MediaItemCatalogBackEndController<SearchVideogameCatalogResultInternal, CatalogVideogameInternal> implements VideogameCatalogController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'videogames';

	/**
	 * @override
	 */
	protected readonly catalogSearchResponseClass = SearchVideogameCatalogResponse;

	/**
	 * @override
	 */
	protected readonly catalogDetailsResponseClass = GetVideogameFromCatalogResponse;

	/**
	 * @override
	 */
	protected getSearchResultsFromResponse(response: SearchVideogameCatalogResponse): SearchVideogameCatalogResultInternal[] {
		return videogameCatalogSearchMapper.toInternalList(response.searchResults);
	}

	/**
	 * @override
	 */
	protected getCatalogDetailsFromResponse(response: GetVideogameFromCatalogResponse): CatalogVideogameInternal {
		return videogameCatalogDetailsMapper.toInternal(response.catalogVideogame);
	}
}
