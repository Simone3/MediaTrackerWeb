import { config } from 'app/config/config';
import { MovieCatalogController, MovieController } from 'app/controllers/interfaces/entities/media-items/movie';
import { MovieMockedCatalogController, MovieMockedController } from 'app/controllers/implementations/mocks/entities/media-items/movie';
import { MovieBackEndController, MovieCatalogBackEndController } from 'app/controllers/implementations/real/entities/media-items/movie';

/**
 * Singleton implementation of the movie controller
 */
export const movieController: MovieController = config.mocks.mediaItems ? new MovieMockedController() : new MovieBackEndController();

/**
 * Singleton implementation of the movie catalog controller
 */
export const movieCatalogController: MovieCatalogController = config.mocks.mediaItems ? new MovieMockedCatalogController() : new MovieCatalogBackEndController();
