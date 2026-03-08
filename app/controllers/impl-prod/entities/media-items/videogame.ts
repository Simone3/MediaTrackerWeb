import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/core/common/back-end-invoker';
import { VideogameCatalogController, VideogameController, VideogameDefinitionsController } from 'app/controllers/core/entities/media-items/videogame';
import { videogameCatalogDetailsMapper, videogameCatalogSearchMapper, videogameFilterMapper, videogameMapper, videogameSortMapper } from 'app/data/mappers/media-items/videogame';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddVideogameRequest, FilterVideogamesRequest, FilterVideogamesResponse, GetVideogameFromCatalogResponse, SearchVideogameCatalogResponse, SearchVideogamesRequest, SearchVideogamesResponse, UpdateVideogameRequest } from 'app/data/models/api/media-items/videogame';
import { CatalogVideogameInternal, DEFAULT_VIDEOGAME, SearchVideogameCatalogResultInternal, VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the VideogameController that queries the back-end APIs
 * @see VideogameController
 */
export class VideogameBackEndController implements VideogameController {

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: VideogameFilterInternal, sortBy?: VideogameSortByInternal[]): Promise<VideogameInternal[]> {
		
		const request: FilterVideogamesRequest = {
			filter: filter ? videogameFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? videogameSortMapper.toExternalList(sortBy) : undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/videogames/filter' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: FilterVideogamesResponse
		});
		
		return videogameMapper.toInternalList(response.videogames);
	}

	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string): Promise<VideogameInternal[]> {

		const request: SearchVideogamesRequest = {
			searchTerm: searchTerm,
			filter: undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/videogames/search' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: SearchVideogamesResponse
		});
		
		return videogameMapper.toInternalList(response.videogames);
	}
	
	/**
	 * @override
	 */
	public async save(userId: string, categoryId: string, videogame: VideogameInternal): Promise<void> {

		if(videogame.id) {

			const request: UpdateVideogameRequest = {
				videogame: videogameMapper.toExternal(videogame)
			};
	
			await backEndInvoker.invoke({
				method: 'PUT',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/videogames/:id' ], {
					userId: userId,
					categoryId: categoryId,
					id: videogame.id
				}),
				requestBody: request,
				responseBodyClass: UpdateMediaItemResponse
			});
		}
		else {

			const request: AddVideogameRequest = {
				newVideogame: videogameMapper.toExternal(videogame)
			};
	
			await backEndInvoker.invoke({
				method: 'POST',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/videogames' ], {
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
	public async delete(userId: string, categoryId: string, videogameId: string): Promise<void> {

		await backEndInvoker.invoke({
			method: 'DELETE',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/videogames/:id' ], {
				userId: userId,
				categoryId: categoryId,
				id: videogameId
			}),
			responseBodyClass: DeleteMediaItemResponse
		});
	}
}

/**
 * Implementation of the VideogameCatalogController that queries the back-end APIs
 * @see VideogameCatalogController
 */
export class VideogameCatalogBackEndController implements VideogameCatalogController {

	/**
	 * @override
	 */
	public async search(searchTerm: string): Promise<SearchVideogameCatalogResultInternal[]> {

		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/catalog/videogames/search/:searchTerm' ], {
				searchTerm: searchTerm
			}),
			responseBodyClass: SearchVideogameCatalogResponse
		});
		
		return videogameCatalogSearchMapper.toInternalList(response.searchResults);
	}

	/**
	 * @override
	 */
	public async getDetails(catalogId: string): Promise<CatalogVideogameInternal> {

		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/catalog/videogames/:catalogId' ], {
				catalogId: catalogId
			}),
			responseBodyClass: GetVideogameFromCatalogResponse
		});
		
		return videogameCatalogDetailsMapper.toInternal(response.catalogVideogame);
	}
}

/**
 * Production implementation of the VideogameDefinitionsController
 * @see VideogameDefinitionsController
 */
export class VideogameDefinitionsControllerImpl implements VideogameDefinitionsController {

	/**
	 * @override
	 */
	public getDefaultFilter(): VideogameFilterInternal {
		
		return {
			status: 'CURRENT'
		};
	}

	/**
	 * @override
	 */
	public getDefaultSortBy(): VideogameSortByInternal[] {
		
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
	public getViewGroupSortBy(): VideogameSortByInternal[] {

		return [{
			field: 'GROUP',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	public getCreatorNames(mediaItem: VideogameInternal): string[] | undefined {

		return mediaItem.developers;
	}

	/**
	 * @override
	 */
	public getDurationValue(mediaItem: VideogameInternal): number | undefined {

		return mediaItem.averageLengthHours;
	}

	/**
	 * @override
	 */
	public getDefaultMediaItem(): VideogameInternal {
		
		return DEFAULT_VIDEOGAME;
	}
}
