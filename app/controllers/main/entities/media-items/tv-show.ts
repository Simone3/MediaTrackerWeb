import { config } from 'app/config/config';
import { TvShowCatalogController, TvShowController } from 'app/controllers/interfaces/entities/media-items/tv-show';
import { TvShowMockedCatalogController, TvShowMockedController } from 'app/controllers/implementations/mocks/entities/media-items/tv-show';
import { TvShowBackEndController, TvShowCatalogBackEndController } from 'app/controllers/implementations/real/entities/media-items/tv-show';

/**
 * Singleton implementation of the TV shows controller
 */
export const tvShowController: TvShowController = config.mocks.mediaItems ? new TvShowMockedController() : new TvShowBackEndController();

/**
 * Singleton implementation of the TV shows catalog controller
 */
export const tvShowCatalogController: TvShowCatalogController = config.mocks.mediaItems ? new TvShowMockedCatalogController() : new TvShowCatalogBackEndController();
