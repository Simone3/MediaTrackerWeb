import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/main/common/back-end-invoker';
import { MediaItemBackEndController } from 'app/controllers/implementations/real/entities/media-items/media-item';
import { MovieCatalogController, MovieController } from 'app/controllers/interfaces/entities/media-items/movie';
import { paginationMapper } from 'app/data/mappers/common';
import { movieCatalogDetailsMapper, movieCatalogSearchMapper, movieFilterMapper, movieMapper, movieSortMapper } from 'app/data/mappers/media-items/movie';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddMovieRequest, FilterMoviesRequest, FilterMoviesResponse, GetMovieFromCatalogResponse, SearchMovieCatalogResponse, SearchMoviesRequest, SearchMoviesResponse, UpdateMovieRequest } from 'app/data/models/api/media-items/movie';
import { PaginatedResultInternal, PaginationInternal } from 'app/data/models/internal/common';
import { CatalogMovieInternal, MovieFilterInternal, MovieInternal, MovieSortByInternal, SearchMovieCatalogResultInternal } from 'app/data/models/internal/media-items/movie';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the MovieController that queries the back-end APIs
 * @see MovieController
 */
export class MovieBackEndController extends MediaItemBackEndController implements MovieController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'movies';

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: MovieFilterInternal, sortBy?: MovieSortByInternal[], pagination?: PaginationInternal): Promise<PaginatedResultInternal<MovieInternal>> {
		const request: FilterMoviesRequest = {
			filter: filter ? movieFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? movieSortMapper.toExternalList(sortBy) : undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/movies/filter' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: FilterMoviesResponse
		});
		
		return {
			elements: movieMapper.toInternalList(response.movies),
			totalCount: response.pagination ? response.pagination.totalCount : response.movies.length
		};
	}

	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string, pagination?: PaginationInternal): Promise<PaginatedResultInternal<MovieInternal>> {
		const request: SearchMoviesRequest = {
			searchTerm: searchTerm,
			filter: undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/movies/search' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: SearchMoviesResponse
		});
		
		return {
			elements: movieMapper.toInternalList(response.movies),
			totalCount: response.pagination ? response.pagination.totalCount : response.movies.length
		};
	}
	
	/**
	 * @override
	 */
	public async save(userId: string, categoryId: string, movie: MovieInternal): Promise<void> {
		if(movie.id) {
			const request: UpdateMovieRequest = {
				movie: movieMapper.toExternal(movie)
			};
	
			await backEndInvoker.invoke({
				method: 'PUT',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/movies/:id' ], {
					userId: userId,
					categoryId: categoryId,
					id: movie.id
				}),
				requestBody: request,
				responseBodyClass: UpdateMediaItemResponse
			});
		}
		else {
			const request: AddMovieRequest = {
				newMovie: movieMapper.toExternal(movie)
			};
	
			await backEndInvoker.invoke({
				method: 'POST',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/movies' ], {
					userId: userId,
					categoryId: categoryId
				}),
				requestBody: request,
				responseBodyClass: AddMediaItemResponse
			});
		}
	}

	/**
	 * @override
	 */
	public async delete(userId: string, categoryId: string, movieId: string): Promise<void> {
		await backEndInvoker.invoke({
			method: 'DELETE',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/movies/:id' ], {
				userId: userId,
				categoryId: categoryId,
				id: movieId
			}),
			responseBodyClass: DeleteMediaItemResponse
		});
	}
}

/**
 * Implementation of the MovieCatalogController that queries the back-end APIs
 * @see MovieCatalogController
 */
export class MovieCatalogBackEndController implements MovieCatalogController {
	/**
	 * @override
	 */
	public async search(searchTerm: string): Promise<SearchMovieCatalogResultInternal[]> {
		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/catalog/movies/search/:searchTerm' ], {
				searchTerm: searchTerm
			}),
			responseBodyClass: SearchMovieCatalogResponse
		});
		
		return movieCatalogSearchMapper.toInternalList(response.searchResults);
	}

	/**
	 * @override
	 */
	public async getDetails(catalogId: string): Promise<CatalogMovieInternal> {
		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/catalog/movies/:catalogId' ], {
				catalogId: catalogId
			}),
			responseBodyClass: GetMovieFromCatalogResponse
		});
		
		return movieCatalogDetailsMapper.toInternal(response.catalogMovie);
	}
}
