import { MediaItemDefinitionsController } from 'app/controllers/core/entities/media-items/media-item';
import { TvShowDefinitionsControllerImpl } from 'app/controllers/impl-definitions/entities/media-items/tv-show';
import { TvShowFilterInternal, TvShowInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Singleton implementation of the TV show definitions controller
 */
export const tvShowDefinitionsController: MediaItemDefinitionsController<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal> = new TvShowDefinitionsControllerImpl();
