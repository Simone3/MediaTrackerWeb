import { MediaItemDefinitionsController } from 'app/controllers/core/entities/media-items/media-item';
import { VideogameDefinitionsControllerImpl } from 'app/controllers/impl-definitions/entities/media-items/videogame';
import { VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';

/**
 * Singleton implementation of the videogame definitions controller
 */
export const videogameDefinitionsController: MediaItemDefinitionsController<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal> = new VideogameDefinitionsControllerImpl();
