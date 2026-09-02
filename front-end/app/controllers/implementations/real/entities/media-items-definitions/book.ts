import { MediaItemDefinitionsControllerImpl } from 'app/controllers/implementations/real/entities/media-items-definitions/media-item';
import { BookDefinitionsController } from 'app/controllers/interfaces/entities/media-items/book';
import { BookFilterInternal, BookInternal, BookSortByInternal, DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';

/**
 * Shared implementation of the Book definitions controller
 */
export class BookDefinitionsControllerImpl extends MediaItemDefinitionsControllerImpl<BookInternal, BookSortByInternal, BookFilterInternal> implements BookDefinitionsController {
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
