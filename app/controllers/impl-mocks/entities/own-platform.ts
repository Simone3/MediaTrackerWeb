import { OwnPlatformController } from 'app/controllers/core/entities/own-platform';
import { MockControllerHelper } from 'app/controllers/impl-mocks/common/mock-helper';
import { OwnPlatformFilterInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';

/**
 * Mocked implementation of the OwnPlatformController that contains an in-memory list of own platforms
 * @see Own platformController
 */
export class OwnPlatformMockedController extends MockControllerHelper implements OwnPlatformController {

	protected delay = 0;
	protected errorProbability = 0;

	protected readonly ownPlatforms: {[user: string]: {[category: string]: OwnPlatformInternal[]}} = {
		test: {
			2: [{
				id: '1',
				name: 'Netflix',
				color: '#f25a5a',
				icon: 'netflix'
			}, {
				id: '2',
				name: 'Hulu',
				color: '#74eb74',
				icon: 'hulu'
			}, {
				id: '3',
				name: 'Disc',
				color: '#4bead7',
				icon: 'disc'
			}]
		}
	};

	/**
	 * @override
	 */
	public async getAllOwnPlatforms(userId: string, categoryId: string): Promise<OwnPlatformInternal[]> {
		
		return this.resolveResult(() => {

			return this.getCategoryOwnPlatforms(userId, categoryId).slice();
		});
	}

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: OwnPlatformFilterInternal): Promise<OwnPlatformInternal[]> {

		return this.resolveResult(() => {

			const categoryOwnPlatforms = this.getCategoryOwnPlatforms(userId, categoryId);

			if(filter && filter.name) {

				return categoryOwnPlatforms.filter((platform) => {
	
					return filter.name && filter.name.toUpperCase() === platform.name.toUpperCase();
				});
			}
			else {

				return categoryOwnPlatforms.slice();
			}
		});
	}

	/**
	 * @override
	 */
	public async saveOwnPlatform(userId: string, categoryId: string, ownPlatform: OwnPlatformInternal): Promise<void> {

		return this.resolveResult(() => {
			
			const categoryOwnPlatforms = this.getCategoryOwnPlatforms(userId, categoryId);
			
			if(ownPlatform.id) {

				const i = categoryOwnPlatforms.findIndex((item) => {
					return item.id === ownPlatform.id;
				});

				categoryOwnPlatforms[i] = ownPlatform;
			}
			else {

				categoryOwnPlatforms.push({
					...ownPlatform,
					id: this.randomId()
				});
			}
			
			this.ownPlatforms[userId][categoryId] = categoryOwnPlatforms;
		});
	}

	/**
	 * @override
	 */
	public async deleteOwnPlatform(userId: string, categoryId: string, ownPlatformId: string): Promise<void> {

		return this.resolveResult(() => {
			
			const categoryOwnPlatforms = this.getCategoryOwnPlatforms(userId, categoryId);
			
			const i = categoryOwnPlatforms.findIndex((item) => {
				return item.id === ownPlatformId;
			});
			
			categoryOwnPlatforms.splice(i, 1);

			this.ownPlatforms[userId][categoryId] = categoryOwnPlatforms;
		});
	}

	/**
	 * Helper to get all own platforms in the category
	 * @param userId the user
	 * @param categoryId the category
	 * @returns the own platforms
	 */
	private getCategoryOwnPlatforms(userId: string, categoryId: string): OwnPlatformInternal[] {

		let categoryOwnPlatforms: OwnPlatformInternal[];
		if(userId in this.ownPlatforms && categoryId in this.ownPlatforms[userId]) {

			categoryOwnPlatforms = this.ownPlatforms[userId][categoryId];
		}
		else {
			
			categoryOwnPlatforms = [];
		}
		return categoryOwnPlatforms;
	}
}
