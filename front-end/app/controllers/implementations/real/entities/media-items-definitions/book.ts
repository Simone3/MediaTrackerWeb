import { MediaItemDefinitionsController } from 'app/controllers/interfaces/entities/media-items/media-item';
import { BookFilterInternal, BookInternal, BookSortByInternal, DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';

/**
 * Shared implementation of the Book definitions controller
 */
export class BookDefinitionsControllerImpl implements MediaItemDefinitionsController<BookInternal, BookSortByInternal, BookFilterInternal> {
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
