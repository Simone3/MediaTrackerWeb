import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/core/common/back-end-invoker';
import { BookCatalogController, BookController, BookDefinitionsController } from 'app/controllers/core/entities/media-items/book';
import { bookCatalogDetailsMapper, bookCatalogSearchMapper, bookFilterMapper, bookMapper, bookSortMapper } from 'app/data/mappers/media-items/book';
import { AddBookRequest, FilterBooksRequest, FilterBooksResponse, GetBookFromCatalogResponse, SearchBookCatalogResponse, SearchBooksRequest, SearchBooksResponse, UpdateBookRequest } from 'app/data/models/api/media-items/book';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { BookFilterInternal, BookInternal, BookSortByInternal, CatalogBookInternal, DEFAULT_BOOK, SearchBookCatalogResultInternal } from 'app/data/models/internal/media-items/book';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the BookController that queries the back-end APIs
 * @see BookController
 */
export class BookBackEndController implements BookController {

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: BookFilterInternal, sortBy?: BookSortByInternal[]): Promise<BookInternal[]> {
		
		const request: FilterBooksRequest = {
			filter: filter ? bookFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? bookSortMapper.toExternalList(sortBy) : undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/books/filter' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: FilterBooksResponse
		});
		
		return bookMapper.toInternalList(response.books);
	}

	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string): Promise<BookInternal[]> {

		const request: SearchBooksRequest = {
			searchTerm: searchTerm,
			filter: undefined
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/books/search' ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: SearchBooksResponse
		});
		
		return bookMapper.toInternalList(response.books);
	}
	
	/**
	 * @override
	 */
	public async save(userId: string, categoryId: string, book: BookInternal): Promise<void> {

		if(book.id) {

			const request: UpdateBookRequest = {
				book: bookMapper.toExternal(book)
			};
	
			await backEndInvoker.invoke({
				method: 'PUT',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/books/:id' ], {
					userId: userId,
					categoryId: categoryId,
					id: book.id
				}),
				requestBody: request,
				responseBodyClass: UpdateMediaItemResponse
			});
		}
		else {

			const request: AddBookRequest = {
				newBook: bookMapper.toExternal(book)
			};
	
			await backEndInvoker.invoke({
				method: 'POST',
				url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/books' ], {
					userId: userId,
					categoryId: categoryId
				}),
				requestBody: request,
				responseBodyClass: AddMediaItemResponse
			});
		}
	}

	/**
	 * @override
	 */
	public async delete(userId: string, categoryId: string, bookId: string): Promise<void> {

		await backEndInvoker.invoke({
			method: 'DELETE',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/categories/:categoryId/books/:id' ], {
				userId: userId,
				categoryId: categoryId,
				id: bookId
			}),
			responseBodyClass: DeleteMediaItemResponse
		});
	}
}

/**
 * Implementation of the BookCatalogController that queries the back-end APIs
 * @see BookCatalogController
 */
export class BookCatalogBackEndController implements BookCatalogController {

	/**
	 * @override
	 */
	public async search(searchTerm: string): Promise<SearchBookCatalogResultInternal[]> {

		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/catalog/books/search/:searchTerm' ], {
				searchTerm: searchTerm
			}),
			responseBodyClass: SearchBookCatalogResponse
		});
		
		return bookCatalogSearchMapper.toInternalList(response.searchResults);
	}

	/**
	 * @override
	 */
	public async getDetails(catalogId: string): Promise<CatalogBookInternal> {

		const response = await backEndInvoker.invoke({
			method: 'GET',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/catalog/books/:catalogId' ], {
				catalogId: catalogId
			}),
			responseBodyClass: GetBookFromCatalogResponse
		});
		
		return bookCatalogDetailsMapper.toInternal(response.catalogBook);
	}
}

/**
 * Production implementation of the BookDefinitionsController
 * @see BookDefinitionsController
 */
export class BookDefinitionsControllerImpl implements BookDefinitionsController {

	/**
	 * @override
	 */
	public getDefaultFilter(): BookFilterInternal {
		
		return {
			status: 'CURRENT'
		};
	}

	/**
	 * @override
	 */
	public getDefaultSortBy(): BookSortByInternal[] {

		return [{
			field: 'ACTIVE',
			ascending: false
		}, {
			field: 'IMPORTANCE',
			ascending: false
		}, {
			field: 'RELEASE_DATE',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	public getViewGroupSortBy(): BookSortByInternal[] {

		return [{
			field: 'GROUP',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	public getCreatorNames(mediaItem: BookInternal): string[] | undefined {

		return mediaItem.authors;
	}

	/**
	 * @override
	 */
	public getDurationValue(mediaItem: BookInternal): number | undefined {

		return mediaItem.pagesNumber;
	}

	/**
	 * @override
	 */
	public getDefaultMediaItem(): BookInternal {
		
		return DEFAULT_BOOK;
	}
}
