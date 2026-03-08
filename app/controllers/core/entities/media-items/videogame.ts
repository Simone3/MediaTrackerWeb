import { config } from 'app/config/config';
import { MediaItemCatalogController, MediaItemController, MediaItemDefinitionsController } from 'app/controllers/core/entities/media-items/media-item';
import { VideogameMockedCatalogController, VideogameMockedController } from 'app/controllers/impl-mocks/entities/media-items/videogame';
import { VideogameBackEndController, VideogameCatalogBackEndController, VideogameDefinitionsControllerImpl } from 'app/controllers/impl-prod/entities/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal, VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';

/**
 * The data controller for videogames
 * @see MediaItemController
 */
export type VideogameController = MediaItemController<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal>;

/**
 * The catalog controller for videogames
 * @see MediaItemCatalogController
 */
export type VideogameCatalogController = MediaItemCatalogController<SearchVideogameCatalogResultInternal, CatalogVideogameInternal>;

/**
 * The definitions controller for videogames
 * @see MediaItemDefinitionsController
 */
export type VideogameDefinitionsController = MediaItemDefinitionsController<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal>;

/**
 * Singleton implementation of the videogame controller
 */
export const videogameController: VideogameController = config.mocks.mediaItems ? new VideogameMockedController() : new VideogameBackEndController();

/**
 * Singleton implementation of the videogame catalog controller
 */
export const videogameCatalogController: VideogameCatalogController = config.mocks.mediaItems ? new VideogameMockedCatalogController() : new VideogameCatalogBackEndController();

/**
 * Singleton implementation of the videogame definitions controller
 */
export const videogameDefinitionsController: VideogameDefinitionsController = new VideogameDefinitionsControllerImpl();
