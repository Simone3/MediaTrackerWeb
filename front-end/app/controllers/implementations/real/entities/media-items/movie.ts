import { MediaItemBackEndController, MediaItemCatalogBackEndController } from 'app/controllers/implementations/real/entities/media-items/media-item';
import { MovieCatalogController, MovieController } from 'app/controllers/interfaces/entities/media-items/movie';
import { paginationMapper } from 'app/data/mappers/common';
import { movieCatalogDetailsMapper, movieCatalogSearchMapper, movieFilterMapper, movieMapper, movieSortMapper } from 'app/data/mappers/media-items/movie';
import { AddMovieRequest, FilterMoviesRequest, FilterMoviesResponse, GetMovieFromCatalogResponse, SearchMovieCatalogResponse, SearchMoviesRequest, SearchMoviesResponse, UpdateMovieRequest } from 'app/data/models/api/media-items/movie';
import { PaginationInternal } from 'app/data/models/internal/common';
import { CatalogMovieInternal, MovieFilterInternal, MovieInternal, MovieSortByInternal, SearchMovieCatalogResultInternal } from 'app/data/models/internal/media-items/movie';

/**
 * Implementation of the MovieController that queries the back-end APIs
 * @see MovieController
 */
export class MovieBackEndController extends MediaItemBackEndController<MovieInternal, MovieSortByInternal, MovieFilterInternal> implements MovieController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'movies';

	/**
	 * @override
	 */
	protected readonly filterResponseClass = FilterMoviesResponse;

	/**
	 * @override
	 */
	protected readonly searchResponseClass = SearchMoviesResponse;

	/**
	 * @override
	 */
	protected buildFilterRequest(filter?: MovieFilterInternal, sortBy?: MovieSortByInternal[], pagination?: PaginationInternal): FilterMoviesRequest {
		return {
			filter: filter ? movieFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? movieSortMapper.toExternalList(sortBy) : undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};
	}

	/**
	 * @override
	 */
	protected buildSearchRequest(searchTerm: string, pagination?: PaginationInternal): SearchMoviesRequest {
		return {
			searchTerm: searchTerm,
			filter: undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};
	}

	/**
	 * @override
	 */
	protected getMediaItemsFromResponse(response: FilterMoviesResponse | SearchMoviesResponse): MovieInternal[] {
		return movieMapper.toInternalList(response.movies);
	}

	/**
	 * @override
	 */
	protected buildAddRequest(movie: MovieInternal): AddMovieRequest {
		return {
			newMovie: movieMapper.toExternal(movie)
		};
	}

	/**
	 * @override
	 */
	protected buildUpdateRequest(movie: MovieInternal): UpdateMovieRequest {
		return {
			movie: movieMapper.toExternal(movie)
		};
	}
}

/**
 * Implementation of the MovieCatalogController that queries the back-end APIs
 * @see MovieCatalogController
 */
export class MovieCatalogBackEndController extends MediaItemCatalogBackEndController<SearchMovieCatalogResultInternal, CatalogMovieInternal> implements MovieCatalogController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'movies';

	/**
	 * @override
	 */
	protected readonly catalogSearchResponseClass = SearchMovieCatalogResponse;

	/**
	 * @override
	 */
	protected readonly catalogDetailsResponseClass = GetMovieFromCatalogResponse;

	/**
	 * @override
	 */
	protected getSearchResultsFromResponse(response: SearchMovieCatalogResponse): SearchMovieCatalogResultInternal[] {
		return movieCatalogSearchMapper.toInternalList(response.searchResults);
	}

	/**
	 * @override
	 */
	protected getCatalogDetailsFromResponse(response: GetMovieFromCatalogResponse): CatalogMovieInternal {
		return movieCatalogDetailsMapper.toInternal(response.catalogMovie);
	}
}
