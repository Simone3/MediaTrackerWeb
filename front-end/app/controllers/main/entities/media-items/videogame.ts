import { config } from 'app/config/config';
import { VideogameCatalogController, VideogameController } from 'app/controllers/interfaces/entities/media-items/videogame';
import { VideogameMockedCatalogController, VideogameMockedController } from 'app/controllers/implementations/mocks/entities/media-items/videogame';
import { VideogameBackEndController, VideogameCatalogBackEndController } from 'app/controllers/implementations/real/entities/media-items/videogame';

/**
 * Singleton implementation of the videogame controller
 */
export const videogameController: VideogameController = config.mocks.mediaItems ? new VideogameMockedController() : new VideogameBackEndController();

/**
 * Singleton implementation of the videogame catalog controller
 */
export const videogameCatalogController: VideogameCatalogController = config.mocks.mediaItems ? new VideogameMockedCatalogController() : new VideogameCatalogBackEndController();
