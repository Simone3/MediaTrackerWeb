import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/core/common/back-end-invoker';
import { OwnPlatformController } from 'app/controllers/core/entities/own-platform';
import { ownPlatformFilterMapper, ownPlatformMapper } from 'app/data/mappers/own-platform';
import { AddOwnPlatformRequest, AddOwnPlatformResponse, DeleteOwnPlatformResponse, FilterOwnPlatformsRequest, FilterOwnPlatformsResponse, GetAllOwnPlatformsResponse, UpdateOwnPlatformRequest, UpdateOwnPlatformResponse } from 'app/data/models/api/own-platform';
import { OwnPlatformFilterInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the OwnPlatformController that queries the back-end APIs
 * @see OwnPlatformController
 */
export class OwnPlatformBackEndController implements OwnPlatformController {

	/**
	 * @override
	 */
	public async getAllOwnPlatforms(userId: string, categoryId: string): Promise<OwnPlatformInternal[]> {
		
		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/own-platforms' ], {
				userId: userId,
				categoryId: categoryId
			}),
			responseBodyClass: GetAllOwnPlatformsResponse
		});
		
		return ownPlatformMapper.toInternalList(response.ownPlatforms);
	}

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: OwnPlatformFilterInternal): Promise<OwnPlatformInternal[]> {
		
		const request: FilterOwnPlatformsRequest = {
			filter: filter ? ownPlatformFilterMapper.toExternal(filter) : undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/own-platforms/filter' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: FilterOwnPlatformsResponse
		});
		
		return ownPlatformMapper.toInternalList(response.ownPlatforms);
	}
	
	/**
	 * @override
	 */
	public async saveOwnPlatform(userId: string, categoryId: string, ownPlatform: OwnPlatformInternal): Promise<void> {

		if(ownPlatform.id) {

			const request: UpdateOwnPlatformRequest = {
				ownPlatform: ownPlatformMapper.toExternal(ownPlatform)
			};
	
			await backEndInvoker.invoke({
				method: 'PUT',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/own-platforms/:id' ], {
					userId: userId,
					categoryId: categoryId,
					id: ownPlatform.id
				}),
				requestBody: request,
				responseBodyClass: UpdateOwnPlatformResponse
			});
		}
		else {

			const request: AddOwnPlatformRequest = {
				newOwnPlatform: ownPlatformMapper.toExternal(ownPlatform)
			};
	
			await backEndInvoker.invoke({
				method: 'POST',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/own-platforms' ], {
					userId: userId,
					categoryId: categoryId
				}),
				requestBody: request,
				responseBodyClass: AddOwnPlatformResponse
			});
		}
	}

	/**
	 * @override
	 */
	public async deleteOwnPlatform(userId: string, categoryId: string, ownPlatformId: string): Promise<void> {

		await backEndInvoker.invoke({
			method: 'DELETE',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/own-platforms/:id' ], {
				userId: userId,
				categoryId: categoryId,
				id: ownPlatformId
			}),
			responseBodyClass: DeleteOwnPlatformResponse
		});
	}
}
