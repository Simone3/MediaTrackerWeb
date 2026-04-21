import { MediaItemCatalogController, MediaItemController, MediaItemDefinitionsController } from 'app/controllers/interfaces/entities/media-items/media-item';
import { BookFilterInternal, BookInternal, BookSortByInternal, CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/data/models/internal/media-items/book';

/**
 * The data controller for books
 * @see MediaItemController
 */
export type BookController = MediaItemController<BookInternal, BookSortByInternal, BookFilterInternal>;

/**
 * The catalog controller for books
 * @see MediaItemCatalogController
 */
export type BookCatalogController = MediaItemCatalogController<SearchBookCatalogResultInternal, CatalogBookInternal>;

/**
 * The definitions controller for books
 * @see MediaItemDefinitionsController
 */
export type BookDefinitionsController = MediaItemDefinitionsController<BookInternal, BookSortByInternal, BookFilterInternal>;
