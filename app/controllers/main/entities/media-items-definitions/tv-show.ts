import { TvShowDefinitionsController } from 'app/controllers/interfaces/entities/media-items/tv-show';
import { TvShowDefinitionsControllerImpl } from 'app/controllers/implementations/real/entities/media-items-definitions/tv-show';

/**
 * Singleton implementation of the TV show definitions controller
 */
export const tvShowDefinitionsController: TvShowDefinitionsController = new TvShowDefinitionsControllerImpl();
