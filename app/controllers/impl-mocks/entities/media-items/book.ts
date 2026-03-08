import { BookCatalogController, BookController } from 'app/controllers/core/entities/media-items/book';
import { MediaItemMockedCatalogController, MediaItemMockedController } from 'app/controllers/impl-mocks/entities/media-items/media-item';
import { BookFilterInternal, BookInternal, BookSortByInternal, CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/data/models/internal/media-items/book';

/**
 * Mocked implementation of the BookController that contains an in-memory list of books
 * @see BookController
 */
export class BookMockedController extends MediaItemMockedController<BookInternal, BookSortByInternal, BookFilterInternal> implements BookController {

	protected readonly mediaItems: {[user: string]: {[category: string]: BookInternal[]}} = {
		test: {
			1: [{
				id: '1',
				mediaType: 'BOOK',
				status: 'NEW',
				name: 'My First Book',
				importance: '400'
			}, {
				id: '2',
				mediaType: 'BOOK',
				status: 'NEW',
				name: 'My Second Book',
				importance: '100',
				pagesNumber: 500
			}, {
				id: '3',
				mediaType: 'BOOK',
				status: 'ACTIVE',
				name: 'My Third Book',
				importance: '300',
				active: true
			}, {
				id: '4',
				mediaType: 'BOOK',
				status: 'NEW',
				name: 'My Fourth Book',
				importance: '200'
			}]
		}
	};
}

/**
 * Mocked implementation of the BookCatalogController that contains an in-memory list of books
 * @see BookCatalogController
 */
export class BookMockedCatalogController extends MediaItemMockedCatalogController<SearchBookCatalogResultInternal, CatalogBookInternal> implements BookCatalogController {

}
