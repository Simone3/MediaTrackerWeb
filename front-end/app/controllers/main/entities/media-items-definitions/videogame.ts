import { VideogameDefinitionsController } from 'app/controllers/interfaces/entities/media-items/videogame';
import { VideogameDefinitionsControllerImpl } from 'app/controllers/implementations/real/entities/media-items-definitions/videogame';

/**
 * Singleton implementation of the videogame definitions controller
 */
export const videogameDefinitionsController: VideogameDefinitionsController = new VideogameDefinitionsControllerImpl();
