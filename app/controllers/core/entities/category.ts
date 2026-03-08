import { config } from 'app/config/config';
import { CategoryMockedController } from 'app/controllers/impl-mocks/entities/category';
import { CategoryBackEndController } from 'app/controllers/impl-prod/entities/category';
import { CategoryFilterInternal, CategoryInternal } from 'app/data/models/internal/category';

/**
 * The data controller for the category entities
 */
export interface CategoryController {

	/**
	 * Gets all saved categories for the given user
	 * @param userId the user
	 * @returns the list of categories, as a promise
	 */
	getAllCategories(userId: string): Promise<CategoryInternal[]>;

	/**
	 * Filters the categories of a given user
	 * @param userId the user
	 * @param filter the filter to apply
	 * @returns the list of categories, as a promise
	 */
	filter(userId: string, filter?: CategoryFilterInternal): Promise<CategoryInternal[]>;

	/**
	 * Saves a category, adding it if the ID is not specified or updating it otherwise
	 * @param userId the user
	 * @param category the category
	 */
	saveCategory(userId: string, category: CategoryInternal): Promise<void>;

	/**
	 * Deletes a category
	 * @param userId the user
	 * @param categoryId the category ID
	 */
	deleteCategory(userId: string, categoryId: string): Promise<void>;
}

/**
 * Singleton implementation of the category controller
 */
export const categoryController: CategoryController = config.mocks.categories ? new CategoryMockedController() : new CategoryBackEndController();

