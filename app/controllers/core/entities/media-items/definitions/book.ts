import { MediaItemDefinitionsController } from 'app/controllers/core/entities/media-items/media-item';
import { BookDefinitionsControllerImpl } from 'app/controllers/impl-definitions/entities/media-items/book';
import { BookFilterInternal, BookInternal, BookSortByInternal } from 'app/data/models/internal/media-items/book';

/**
 * Singleton implementation of the book definitions controller
 */
export const bookDefinitionsController: MediaItemDefinitionsController<BookInternal, BookSortByInternal, BookFilterInternal> = new BookDefinitionsControllerImpl();
