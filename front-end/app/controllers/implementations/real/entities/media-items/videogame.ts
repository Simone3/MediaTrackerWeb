import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/main/common/back-end-invoker';
import { MediaItemBackEndController } from 'app/controllers/implementations/real/entities/media-items/media-item';
import { VideogameCatalogController, VideogameController } from 'app/controllers/interfaces/entities/media-items/videogame';
import { paginationMapper } from 'app/data/mappers/common';
import { videogameCatalogDetailsMapper, videogameCatalogSearchMapper, videogameFilterMapper, videogameMapper, videogameSortMapper } from 'app/data/mappers/media-items/videogame';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddVideogameRequest, FilterVideogamesRequest, FilterVideogamesResponse, GetVideogameFromCatalogResponse, SearchVideogameCatalogResponse, SearchVideogamesRequest, SearchVideogamesResponse, UpdateVideogameRequest } from 'app/data/models/api/media-items/videogame';
import { PaginatedResultInternal, PaginationInternal } from 'app/data/models/internal/common';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal, VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the VideogameController that queries the back-end APIs
 * @see VideogameController
 */
export class VideogameBackEndController extends MediaItemBackEndController implements VideogameController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'videogames';

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: VideogameFilterInternal, sortBy?: VideogameSortByInternal[], pagination?: PaginationInternal): Promise<PaginatedResultInternal<VideogameInternal>> {
		const request: FilterVideogamesRequest = {
			filter: filter ? videogameFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? videogameSortMapper.toExternalList(sortBy) : undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
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
		
		return {
			elements: videogameMapper.toInternalList(response.videogames),
			totalCount: response.pagination ? response.pagination.totalCount : response.videogames.length
		};
	}

	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string, pagination?: PaginationInternal): Promise<PaginatedResultInternal<VideogameInternal>> {
		const request: SearchVideogamesRequest = {
			searchTerm: searchTerm,
			filter: undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
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
		
		return {
			elements: videogameMapper.toInternalList(response.videogames),
			totalCount: response.pagination ? response.pagination.totalCount : response.videogames.length
		};
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
