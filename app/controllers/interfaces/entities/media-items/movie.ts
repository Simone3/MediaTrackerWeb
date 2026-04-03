import { MediaItemCatalogController, MediaItemController, MediaItemDefinitionsController } from 'app/controllers/interfaces/entities/media-items/media-item';
import { CatalogMovieInternal, MovieFilterInternal, MovieInternal, MovieSortByInternal, SearchMovieCatalogResultInternal } from 'app/data/models/internal/media-items/movie';

/**
 * The data controller for movies
 * @see MediaItemController
 */
export type MovieController = MediaItemController<MovieInternal, MovieSortByInternal, MovieFilterInternal>;

/**
 * The catalog controller for movies
 * @see MediaItemCatalogController
 */
export type MovieCatalogController = MediaItemCatalogController<SearchMovieCatalogResultInternal, CatalogMovieInternal>;

/**
 * The definitions controller for movies
 * @see MediaItemDefinitionsController
 */
export type MovieDefinitionsController = MediaItemDefinitionsController<MovieInternal, MovieSortByInternal, MovieFilterInternal>;
