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

