import { config } from 'app/config/config';
import { CategoryController } from 'app/controllers/interfaces/entities/category';
import { CategoryMockedController } from 'app/controllers/implementations/mocks/entities/category';
import { CategoryBackEndController } from 'app/controllers/implementations/real/entities/category';

/**
 * Singleton implementation of the category controller
 */
export const categoryController: CategoryController = config.mocks.categories ? new CategoryMockedController() : new CategoryBackEndController();
