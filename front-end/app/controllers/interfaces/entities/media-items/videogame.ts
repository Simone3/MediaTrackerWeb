import { MediaItemCatalogController, MediaItemController, MediaItemDefinitionsController } from 'app/controllers/interfaces/entities/media-items/media-item';
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
