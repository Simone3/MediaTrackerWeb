import { config } from 'app/config/config';
import { BookCatalogController, BookController } from 'app/controllers/interfaces/entities/media-items/book';
import { BookMockedCatalogController, BookMockedController } from 'app/controllers/implementations/mocks/entities/media-items/book';
import { BookBackEndController, BookCatalogBackEndController } from 'app/controllers/implementations/real/entities/media-items/book';

/**
 * Singleton implementation of the book controller
 */
export const bookController: BookController = config.mocks.mediaItems ? new BookMockedController() : new BookBackEndController();

/**
 * Singleton implementation of the book catalog controller
 */
export const bookCatalogController: BookCatalogController = config.mocks.mediaItems ? new BookMockedCatalogController() : new BookCatalogBackEndController();
