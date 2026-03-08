import { CategoryController } from 'app/controllers/core/entities/category';
import { MockControllerHelper } from 'app/controllers/impl-mocks/common/mock-helper';
import { CategoryFilterInternal, CategoryInternal } from 'app/data/models/internal/category';

/**
 * Mocked implementation of the CategoryController that contains an in-memory list of categories
 * @see CategoryController
 */
export class CategoryMockedController extends MockControllerHelper implements CategoryController {

	protected delay = 0;
	protected errorProbability = 0;

	private categories: {[user: string]: CategoryInternal[]} = {
		test: [{
			id: '1',
			color: '#FF0000',
			mediaType: 'BOOK',
			name: 'My Books'
		}, {
			id: '2',
			color: '#008000',
			mediaType: 'MOVIE',
			name: 'My Movies'
		}, {
			id: '3',
			color: '#1E90FF',
			mediaType: 'TV_SHOW',
			name: 'My TV Shows'
		}, {
			id: '4',
			color: '#FFA500',
			mediaType: 'VIDEOGAME',
			name: 'My Videogames'
		}]
	};

	/**
	 * @override
	 */
	public async getAllCategories(userId: string): Promise<CategoryInternal[]> {
		
		return this.resolveResult(() => {

			const userCategories = this.getUserCategories(userId);
			return userCategories.slice();
		});
	}

	/**
	 * @override
	 */
	public async filter(userId: string, filter?: CategoryFilterInternal): Promise<CategoryInternal[]> {

		return this.resolveResult(() => {

			if(filter && filter.name) {

				return this.getUserCategories(userId).filter((category) => {
	
					return filter.name && filter.name.toUpperCase() === category.name.toUpperCase();
				});
			}
			else {

				return this.getUserCategories(userId).slice();
			}
		});
	}

	/**
	 * @override
	 */
	public async saveCategory(userId: string, category: CategoryInternal): Promise<void> {

		return this.resolveResult(() => {
				
			const categories = this.getUserCategories(userId).slice();

			if(category.id) {

				const i = categories.findIndex((cat) => {
					return category.id === cat.id;
				});
				categories[i] = category;
			}
			else {
	
				categories.push({
					...category,
					id: this.randomId()
				});
			}

			this.categories[userId] = categories;
		});
	}

	/**
	 * @override
	 */
	public async deleteCategory(userId: string, categoryId: string): Promise<void> {

		return this.resolveResult(() => {
		
			const categories = this.getUserCategories(userId).slice();

			const i = categories.findIndex((cat) => {
				return categoryId === cat.id;
			});
			
			categories.splice(i, 1);

			this.categories[userId] = categories;
		});
	}

	/**
	 * Helper to get all categories of a user
	 * @param userId the user
	 * @returns the media items
	 */
	private getUserCategories(userId: string): CategoryInternal[] {

		let userCategories: CategoryInternal[];
		if(userId in this.categories) {

			userCategories = this.categories[userId];
		}
		else {
			
			userCategories = [];
		}
		return userCategories;
	}
}
