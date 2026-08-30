import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/main/common/back-end-invoker';
import { BookCatalogController, BookController } from 'app/controllers/interfaces/entities/media-items/book';
import { paginationMapper } from 'app/data/mappers/common';
import { bookCatalogDetailsMapper, bookCatalogSearchMapper, bookFilterMapper, bookMapper, bookSortMapper } from 'app/data/mappers/media-items/book';
import { AddBookRequest, FilterBooksRequest, FilterBooksResponse, GetBookFromCatalogResponse, SearchBookCatalogResponse, SearchBooksRequest, SearchBooksResponse, UpdateBookRequest } from 'app/data/models/api/media-items/book';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { PaginatedResultInternal, PaginationInternal } from 'app/data/models/internal/common';
import { BookFilterInternal, BookInternal, BookSortByInternal, CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/data/models/internal/media-items/book';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Implementation of the BookController that queries the back-end APIs
 * @see BookController
 */
export class BookBackEndController implements BookController {
	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: BookFilterInternal, sortBy?: BookSortByInternal[], pagination?: PaginationInternal): Promise<PaginatedResultInternal<BookInternal>> {
		const request: FilterBooksRequest = {
			filter: filter ? bookFilterMapper.toExternal(filter) : undefined,
			sortBy: sortBy ? bookSortMapper.toExternalList(sortBy) : undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
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
		
		return {
			elements: bookMapper.toInternalList(response.books),
			totalCount: response.pagination ? response.pagination.totalCount : response.books.length
		};
	}

	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string, pagination?: PaginationInternal): Promise<PaginatedResultInternal<BookInternal>> {
		const request: SearchBooksRequest = {
			searchTerm: searchTerm,
			filter: undefined,
			pagination: pagination ? paginationMapper.toExternal(pagination) : undefined
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
		
		return {
			elements: bookMapper.toInternalList(response.books),
			totalCount: response.pagination ? response.pagination.totalCount : response.books.length
		};
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
