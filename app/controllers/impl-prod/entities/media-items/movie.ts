import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/core/common/back-end-invoker';
import { MovieCatalogController, MovieController, MovieDefinitionsController } from 'app/controllers/core/entities/media-items/movie';
import { movieCatalogDetailsMapper, movieCatalogSearchMapper, movieFilterMapper, movieMapper, movieSortMapper } from 'app/data/mappers/media-items/movie';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddMovieRequest, FilterMoviesRequest, FilterMoviesResponse, GetMovieFromCatalogResponse, SearchMovieCatalogResponse, SearchMoviesRequest, SearchMoviesResponse, UpdateMovieRequest } from 'app/data/models/api/media-items/movie';
import { CatalogMovieInternal, DEFAULT_MOVIE, MovieFilterInternal, MovieInternal, MovieSortByInternal, SearchMovieCatalogResultInternal } from 'app/data/models/internal/media-items/movie';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the MovieController that queries the back-end APIs
 * @see MovieController
 */
export class MovieBackEndController implements MovieController {

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: MovieFilterInternal, sortBy?: MovieSortByInternal[]): Promise<MovieInternal[]> {
		
		const request: FilterMoviesRequest = {
			filter: filter ? movieFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? movieSortMapper.toExternalList(sortBy) : undefined
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
		
		return movieMapper.toInternalList(response.movies);
	}

	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string): Promise<MovieInternal[]> {

		const request: SearchMoviesRequest = {
			searchTerm: searchTerm,
			filter: undefined
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
		
		return movieMapper.toInternalList(response.movies);
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

/**
 * Production implementation of the MovieDefinitionsController
 * @see MovieDefinitionsController
 */
export class MovieDefinitionsControllerImpl implements MovieDefinitionsController {

	/**
	 * @override
	 */
	public getDefaultFilter(): MovieFilterInternal {
		
		return {
			status: 'CURRENT'
		};
	}

	/**
	 * @override
	 */
	public getDefaultSortBy(): MovieSortByInternal[] {
		
		return [{
			field: 'ACTIVE',
			ascending: false
		}, {
			field: 'IMPORTANCE',
			ascending: false
		}, {
			field: 'RELEASE_DATE',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	public getViewGroupSortBy(): MovieSortByInternal[] {

		return [{
			field: 'GROUP',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	public getCreatorNames(mediaItem: MovieInternal): string[] | undefined {

		return mediaItem.directors;
	}

	/**
	 * @override
	 */
	public getDurationValue(mediaItem: MovieInternal): number | undefined {

		return mediaItem.durationMinutes;
	}

	/**
	 * @override
	 */
	public getDefaultMediaItem(): MovieInternal {
		
		return DEFAULT_MOVIE;
	}
}

