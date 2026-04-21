import { BookDefinitionsController } from 'app/controllers/interfaces/entities/media-items/book';
import { BookDefinitionsControllerImpl } from 'app/controllers/implementations/real/entities/media-items-definitions/book';

/**
 * Singleton implementation of the book definitions controller
 */
export const bookDefinitionsController: BookDefinitionsController = new BookDefinitionsControllerImpl();
