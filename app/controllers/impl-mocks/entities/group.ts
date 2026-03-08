import { GroupController } from 'app/controllers/core/entities/group';
import { MockControllerHelper } from 'app/controllers/impl-mocks/common/mock-helper';
import { GroupFilterInternal, GroupInternal } from 'app/data/models/internal/group';

/**
 * Mocked implementation of the GroupController that contains an in-memory list of groups
 * @see GroupController
 */
export class GroupMockedController extends MockControllerHelper implements GroupController {

	protected delay = 0;
	protected errorProbability = 0;

	protected readonly groups: {[user: string]: {[category: string]: GroupInternal[]}} = {
		test: {
			2: [{
				id: '1',
				name: 'Group 1'
			}, {
				id: '2',
				name: 'Group 2'
			}]
		}
	};

	/**
	 * @override
	 */
	public async getAllGroups(userId: string, categoryId: string): Promise<GroupInternal[]> {
		
		return this.resolveResult(() => {

			return this.getCategoryGroups(userId, categoryId).slice();
		});
	}

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: GroupFilterInternal): Promise<GroupInternal[]> {

		return this.resolveResult(() => {

			const categoryGroups = this.getCategoryGroups(userId, categoryId);

			if(filter && filter.name) {

				return categoryGroups.filter((group) => {
	
					return filter.name && filter.name.toUpperCase() === group.name.toUpperCase();
				});
			}
			else {

				return categoryGroups.slice();
			}
		});
	}

	/**
	 * @override
	 */
	public async saveGroup(userId: string, categoryId: string, group: GroupInternal): Promise<void> {

		return this.resolveResult(() => {
			
			const categoryGroups = this.getCategoryGroups(userId, categoryId);
			
			if(group.id) {

				const i = categoryGroups.findIndex((item) => {
					return item.id === group.id;
				});

				categoryGroups[i] = group;
			}
			else {

				categoryGroups.push({
					...group,
					id: this.randomId()
				});
			}
			
			this.groups[userId][categoryId] = categoryGroups;
		});
	}

	/**
	 * @override
	 */
	public async deleteGroup(userId: string, categoryId: string, groupId: string): Promise<void> {

		return this.resolveResult(() => {
			
			const categoryGroups = this.getCategoryGroups(userId, categoryId);
			
			const i = categoryGroups.findIndex((item) => {
				return item.id === groupId;
			});
			
			categoryGroups.splice(i, 1);

			this.groups[userId][categoryId] = categoryGroups;
		});
	}

	/**
	 * Helper to get all groups in the category
	 * @param userId the user
	 * @param categoryId the category
	 * @returns the groups
	 */
	private getCategoryGroups(userId: string, categoryId: string): GroupInternal[] {

		let categoryGroups: GroupInternal[];
		if(userId in this.groups && categoryId in this.groups[userId]) {

			categoryGroups = this.groups[userId][categoryId];
		}
		else {
			
			categoryGroups = [];
		}
		return categoryGroups;
	}
}
