import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/core/common/back-end-invoker';
import { TvShowCatalogController, TvShowController, TvShowDefinitionsController } from 'app/controllers/core/entities/media-items/tv-show';
import { tvShowCatalogDetailsMapper, tvShowCatalogSearchMapper, tvShowFilterMapper, tvShowMapper, tvShowSortMapper } from 'app/data/mappers/media-items/tv-show';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddTvShowRequest, FilterTvShowsRequest, FilterTvShowsResponse, GetTvShowFromCatalogResponse, SearchTvShowCatalogResponse, SearchTvShowsRequest, SearchTvShowsResponse, UpdateTvShowRequest } from 'app/data/models/api/media-items/tv-show';
import { CatalogTvShowInternal, DEFAULT_TV_SHOW, SearchTvShowCatalogResultInternal, TvShowFilterInternal, TvShowInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the TvShowController that queries the back-end APIs
 * @see TvShowController
 */
export class TvShowBackEndController implements TvShowController {

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: TvShowFilterInternal, sortBy?: TvShowSortByInternal[]): Promise<TvShowInternal[]> {
		
		const request: FilterTvShowsRequest = {
			filter: filter ? tvShowFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? tvShowSortMapper.toExternalList(sortBy) : undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/tv-shows/filter' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: FilterTvShowsResponse
		});
		
		return tvShowMapper.toInternalList(response.tvShows);
	}

	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string): Promise<TvShowInternal[]> {

		const request: SearchTvShowsRequest = {
			searchTerm: searchTerm,
			filter: undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/tv-shows/search' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: SearchTvShowsResponse
		});
		
		return tvShowMapper.toInternalList(response.tvShows);
	}
	
	/**
	 * @override
	 */
	public async save(userId: string, categoryId: string, tvShow: TvShowInternal): Promise<void> {

		if(tvShow.id) {

			const request: UpdateTvShowRequest = {
				tvShow: tvShowMapper.toExternal(tvShow)
			};
	
			await backEndInvoker.invoke({
				method: 'PUT',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/tv-shows/:id' ], {
					userId: userId,
					categoryId: categoryId,
					id: tvShow.id
				}),
				requestBody: request,
				responseBodyClass: UpdateMediaItemResponse
			});
		}
		else {

			const request: AddTvShowRequest = {
				newTvShow: tvShowMapper.toExternal(tvShow)
			};
	
			await backEndInvoker.invoke({
				method: 'POST',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/tv-shows' ], {
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
	public async delete(userId: string, categoryId: string, tvShowId: string): Promise<void> {

		await backEndInvoker.invoke({
			method: 'DELETE',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/tv-shows/:id' ], {
				userId: userId,
				categoryId: categoryId,
				id: tvShowId
			}),
			responseBodyClass: DeleteMediaItemResponse
		});
	}
}

/**
 * Implementation of the TvShowCatalogController that queries the back-end APIs
 * @see TvShowCatalogController
 */
export class TvShowCatalogBackEndController implements TvShowCatalogController {

	/**
	 * @override
	 */
	public async search(searchTerm: string): Promise<SearchTvShowCatalogResultInternal[]> {

		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/catalog/tv-shows/search/:searchTerm' ], {
				searchTerm: searchTerm
			}),
			responseBodyClass: SearchTvShowCatalogResponse
		});
		
		return tvShowCatalogSearchMapper.toInternalList(response.searchResults);
	}

	/**
	 * @override
	 */
	public async getDetails(catalogId: string): Promise<CatalogTvShowInternal> {

		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/catalog/tv-shows/:catalogId' ], {
				catalogId: catalogId
			}),
			responseBodyClass: GetTvShowFromCatalogResponse
		});
		
		return tvShowCatalogDetailsMapper.toInternal(response.catalogTvShow);
	}
}

/**
 * Production implementation of the TvShowDefinitionsController
 * @see TvShowDefinitionsController
 */
export class TvShowDefinitionsControllerImpl implements TvShowDefinitionsController {

	/**
	 * @override
	 */
	public getDefaultFilter(): TvShowFilterInternal {
		
		return {
			status: 'CURRENT'
		};
	}

	/**
	 * @override
	 */
	public getDefaultSortBy(): TvShowSortByInternal[] {
		
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
	public getViewGroupSortBy(): TvShowSortByInternal[] {

		return [{
			field: 'GROUP',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	public getCreatorNames(mediaItem: TvShowInternal): string[] | undefined {

		return mediaItem.creators;
	}

	/**
	 * @override
	 */
	public getDurationValue(mediaItem: TvShowInternal): number | undefined {

		return mediaItem.averageEpisodeRuntimeMinutes;
	}

	/**
	 * @override
	 */
	public getDefaultMediaItem(): TvShowInternal {
		
		return DEFAULT_TV_SHOW;
	}
}

