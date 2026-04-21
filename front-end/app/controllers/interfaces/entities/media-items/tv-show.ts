import { MediaItemCatalogController, MediaItemController, MediaItemDefinitionsController } from 'app/controllers/interfaces/entities/media-items/media-item';
import { CatalogTvShowInternal, SearchTvShowCatalogResultInternal, TvShowFilterInternal, TvShowInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * The data controller for TV shows
 * @see MediaItemController
 */
export type TvShowController = MediaItemController<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal>;

/**
 * The catalog controller for TV shows
 * @see MediaItemCatalogController
 */
export type TvShowCatalogController = MediaItemCatalogController<SearchTvShowCatalogResultInternal, CatalogTvShowInternal>;

/**
 * The definitions controller for TV shows
 * @see MediaItemDefinitionsController
 */
export type TvShowDefinitionsController = MediaItemDefinitionsController<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal>;
