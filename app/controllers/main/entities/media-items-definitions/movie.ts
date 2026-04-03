import { MovieDefinitionsController } from 'app/controllers/interfaces/entities/media-items/movie';
import { MovieDefinitionsControllerImpl } from 'app/controllers/implementations/real/entities/media-items-definitions/movie';

/**
 * Singleton implementation of the movie definitions controller
 */
export const movieDefinitionsController: MovieDefinitionsController = new MovieDefinitionsControllerImpl();
