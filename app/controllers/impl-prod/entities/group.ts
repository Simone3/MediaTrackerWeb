import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/core/common/back-end-invoker';
import { GroupController } from 'app/controllers/core/entities/group';
import { groupFilterMapper, groupMapper } from 'app/data/mappers/group';
import { AddGroupRequest, AddGroupResponse, DeleteGroupResponse, FilterGroupsRequest, FilterGroupsResponse, GetAllGroupsResponse, UpdateGroupRequest, UpdateGroupResponse } from 'app/data/models/api/group';
import { GroupFilterInternal, GroupInternal } from 'app/data/models/internal/group';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the GroupController that queries the back-end APIs
 * @see GroupController
 */
export class GroupBackEndController implements GroupController {

	/**
	 * @override
	 */
	public async getAllGroups(userId: string, categoryId: string): Promise<GroupInternal[]> {
		
		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/groups' ], {
				userId: userId,
				categoryId: categoryId
			}),
			responseBodyClass: GetAllGroupsResponse
		});
		
		return groupMapper.toInternalList(response.groups);
	}

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: GroupFilterInternal): Promise<GroupInternal[]> {
		
		const request: FilterGroupsRequest = {
			filter: filter ? groupFilterMapper.toExternal(filter) : undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/groups/filter' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: FilterGroupsResponse
		});
		
		return groupMapper.toInternalList(response.groups);
	}
	
	/**
	 * @override
	 */
	public async saveGroup(userId: string, categoryId: string, group: GroupInternal): Promise<void> {

		if(group.id) {

			const request: UpdateGroupRequest = {
				group: groupMapper.toExternal(group)
			};
	
			await backEndInvoker.invoke({
				method: 'PUT',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/groups/:id' ], {
					userId: userId,
					categoryId: categoryId,
					id: group.id
				}),
				requestBody: request,
				responseBodyClass: UpdateGroupResponse
			});
		}
		else {

			const request: AddGroupRequest = {
				newGroup: groupMapper.toExternal(group)
			};
	
			await backEndInvoker.invoke({
				method: 'POST',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/groups' ], {
					userId: userId,
					categoryId: categoryId
				}),
				requestBody: request,
				responseBodyClass: AddGroupResponse
			});
		}
	}

	/**
	 * @override
	 */
	public async deleteGroup(userId: string, categoryId: string, groupId: string): Promise<void> {

		await backEndInvoker.invoke({
			method: 'DELETE',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/groups/:id' ], {
				userId: userId,
				categoryId: categoryId,
				id: groupId
			}),
			responseBodyClass: DeleteGroupResponse
		});
	}
}
