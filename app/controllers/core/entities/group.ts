import { config } from 'app/config/config';
import { GroupMockedController } from 'app/controllers/impl-mocks/entities/group';
import { GroupBackEndController } from 'app/controllers/impl-prod/entities/group';
import { GroupFilterInternal, GroupInternal } from 'app/data/models/internal/group';

/**
 * The data controller for the group entities
 */
export interface GroupController {

	/**
	 * Gets all saved groups for the given category
	 * @param userId the user
	 * @param categoryId the category
	 * @returns the list of groups, as a promise
	 */
	getAllGroups(userId: string, categoryId: string): Promise<GroupInternal[]>;

	/**
	 * Filters the groups of a given category
	 * @param userId the user
	 * @param categoryId the category
	 * @param filter the filter to apply
	 * @returns the list of groups, as a promise
	 */
	filter(userId: string, categoryId: string, filter?: GroupFilterInternal): Promise<GroupInternal[]>;

	/**
	 * Saves a group, adding it if the ID is not specified or updating it otherwise
	 * @param userId the user
	 * @param categoryId the category
	 * @param group the group
	 */
	saveGroup(userId: string, categoryId: string, group: GroupInternal): Promise<void>;

	/**
	 * Deletes a group
	 * @param userId the user
	 * @param categoryId the category
	 * @param groupId the group ID
	 */
	deleteGroup(userId: string, categoryId: string, groupId: string): Promise<void>;
}

/**
 * Singleton implementation of the group controller
 */
export const groupController: GroupController = config.mocks.groups ? new GroupMockedController() : new GroupBackEndController();

