import { MediaItemDefinitionsController } from 'app/controllers/core/entities/media-items/media-item';
import { MovieDefinitionsControllerImpl } from 'app/controllers/impl-definitions/entities/media-items/movie';
import { MovieFilterInternal, MovieInternal, MovieSortByInternal } from 'app/data/models/internal/media-items/movie';

/**
 * Singleton implementation of the movie definitions controller
 */
export const movieDefinitionsController: MediaItemDefinitionsController<MovieInternal, MovieSortByInternal, MovieFilterInternal> = new MovieDefinitionsControllerImpl();
