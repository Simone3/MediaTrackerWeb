import { MediaItemBackEndController, MediaItemCatalogBackEndController } from 'app/controllers/implementations/real/entities/media-items/media-item';
import { BookCatalogController, BookController } from 'app/controllers/interfaces/entities/media-items/book';
import { paginationMapper } from 'app/data/mappers/common';
import { bookCatalogDetailsMapper, bookCatalogSearchMapper, bookFilterMapper, bookMapper, bookSortMapper } from 'app/data/mappers/media-items/book';
import { AddBookRequest, FilterBooksRequest, FilterBooksResponse, GetBookFromCatalogResponse, SearchBookCatalogResponse, SearchBooksRequest, SearchBooksResponse, UpdateBookRequest } from 'app/data/models/api/media-items/book';
import { PaginationInternal } from 'app/data/models/internal/common';
import { BookFilterInternal, BookInternal, BookSortByInternal, CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/data/models/internal/media-items/book';

/**
 * Implementation of the BookController that queries the back-end APIs
 * @see BookController
 */
export class BookBackEndController extends MediaItemBackEndController<BookInternal, BookSortByInternal, BookFilterInternal> implements BookController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'books';

	/**
	 * @override
	 */
	protected readonly filterResponseClass = FilterBooksResponse;

	/**
	 * @override
	 */
	protected readonly searchResponseClass = SearchBooksResponse;

	/**
	 * @override
	 */
	protected buildFilterRequest(filter?: BookFilterInternal, sortBy?: BookSortByInternal[], pagination?: PaginationInternal): FilterBooksRequest {
		return {
			filter: filter ? bookFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? bookSortMapper.toExternalList(sortBy) : undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};
	}

	/**
	 * @override
	 */
	protected buildSearchRequest(searchTerm: string, pagination?: PaginationInternal): SearchBooksRequest {
		return {
			searchTerm: searchTerm,
			filter: undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
		};
	}

	/**
	 * @override
	 */
	protected getMediaItemsFromResponse(response: FilterBooksResponse | SearchBooksResponse): BookInternal[] {
		return bookMapper.toInternalList(response.books);
	}

	/**
	 * @override
	 */
	protected buildAddRequest(book: BookInternal): AddBookRequest {
		return {
			newBook: bookMapper.toExternal(book)
		};
	}

	/**
	 * @override
	 */
	protected buildUpdateRequest(book: BookInternal): UpdateBookRequest {
		return {
			book: bookMapper.toExternal(book)
		};
	}
}

/**
 * Implementation of the BookCatalogController that queries the back-end APIs
 * @see BookCatalogController
 */
export class BookCatalogBackEndController extends MediaItemCatalogBackEndController<SearchBookCatalogResultInternal, CatalogBookInternal> implements BookCatalogController {
	/**
	 * @override
	 */
	protected readonly mediaItemPathName = 'books';

	/**
	 * @override
	 */
	protected readonly catalogSearchResponseClass = SearchBookCatalogResponse;

	/**
	 * @override
	 */
	protected readonly catalogDetailsResponseClass = GetBookFromCatalogResponse;

	/**
	 * @override
	 */
	protected getSearchResultsFromResponse(response: SearchBookCatalogResponse): SearchBookCatalogResultInternal[] {
		return bookCatalogSearchMapper.toInternalList(response.searchResults);
	}

	/**
	 * @override
	 */
	protected getCatalogDetailsFromResponse(response: GetBookFromCatalogResponse): CatalogBookInternal {
		return bookCatalogDetailsMapper.toInternal(response.catalogBook);
	}
}
