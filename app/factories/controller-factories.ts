import { bookCatalogController, bookController, bookDefinitionsController } from 'app/controllers/core/entities/media-items/book';
import { MediaItemCatalogController, MediaItemController, MediaItemDefinitionsController } from 'app/controllers/core/entities/media-items/media-item';
import { movieCatalogController, movieController, movieDefinitionsController } from 'app/controllers/core/entities/media-items/movie';
import { tvShowCatalogController, tvShowController, tvShowDefinitionsController } from 'app/controllers/core/entities/media-items/tv-show';
import { videogameCatalogController, videogameController, videogameDefinitionsController } from 'app/controllers/core/entities/media-items/videogame';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { MediaFactory } from 'app/factories/abstract-factories';

/**
 * Factory for the media item controller
 */
export const mediaItemControllerFactory = new class MediaItemControllerFactory extends MediaFactory<MediaItemController<MediaItemInternal, MediaItemSortByInternal, MediaItemFilterInternal>> {

	/**
	 * @override
	 */
	protected getInternal(mediaType: MediaTypeInternal): MediaItemController<MediaItemInternal, MediaItemSortByInternal, MediaItemFilterInternal> {

		switch(mediaType) {

			case 'BOOK': {
				return bookController;
			}

			case 'MOVIE': {
				return movieController;
			}

			case 'TV_SHOW': {
				return tvShowController;
			}

			case 'VIDEOGAME': {
				return videogameController;
			}

			default: {
				throw AppError.GENERIC.withDetails(`Media type ${mediaType} not recognized in media items controller factory`);
			}
		}
	}
}();

/**
 * Factory for the media item definitions controller
 */
export const mediaItemDefinitionsControllerFactory = new class MediaItemDefinitionsControllerFactory extends MediaFactory<MediaItemDefinitionsController<MediaItemInternal, MediaItemSortByInternal, MediaItemFilterInternal>> {

	/**
	 * @override
	 */
	protected getInternal(mediaType: MediaTypeInternal): MediaItemDefinitionsController<MediaItemInternal, MediaItemSortByInternal, MediaItemFilterInternal> {

		switch(mediaType) {

			case 'BOOK': {
				return bookDefinitionsController;
			}

			case 'MOVIE': {
				return movieDefinitionsController;
			}

			case 'TV_SHOW': {
				return tvShowDefinitionsController;
			}

			case 'VIDEOGAME': {
				return videogameDefinitionsController;
			}

			default: {
				throw AppError.GENERIC.withDetails(`Media type ${mediaType} not recognized in media items definitions controller factory`);
			}
		}
	}
}();

/**
 * Factory for the media item catalog controller
 */
export const mediaItemCatalogControllerFactory = new class MediaItemCatalogControllerFactory extends MediaFactory<MediaItemCatalogController<SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal>> {

	/**
	 * @override
	 */
	protected getInternal(mediaType: MediaTypeInternal): MediaItemCatalogController<SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal> {

		switch(mediaType) {

			case 'BOOK': {
				return bookCatalogController;
			}

			case 'MOVIE': {
				return movieCatalogController;
			}

			case 'TV_SHOW': {
				return tvShowCatalogController;
			}

			case 'VIDEOGAME': {
				return videogameCatalogController;
			}

			default: {
				throw AppError.GENERIC.withDetails(`Media type ${mediaType} not recognized in media items catalog controller factory`);
			}
		}
	}
}();
