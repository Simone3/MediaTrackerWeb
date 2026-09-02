import { MediaItemDefinitionsControllerImpl } from 'app/controllers/implementations/real/entities/media-items-definitions/media-item';
import { TvShowDefinitionsController } from 'app/controllers/interfaces/entities/media-items/tv-show';
import { DEFAULT_TV_SHOW, TvShowFilterInternal, TvShowInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Shared implementation of the TV show definitions controller
 */
export class TvShowDefinitionsControllerImpl extends MediaItemDefinitionsControllerImpl<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal> implements TvShowDefinitionsController {
	/**
	 * @override
	 */
	public getCreatorNames(mediaItem: TvShowInternal): string[] | undefined {
		return mediaItem.creators;
	}

	/**
	 * @override
	 */
	public getDurationValue(mediaItem: TvShowInternal): number | undefined {
		return mediaItem.averageEpisodeRuntimeMinutes;
	}

	/**
	 * @override
	 */
	public getDefaultMediaItem(): TvShowInternal {
		return DEFAULT_TV_SHOW;
	}
}
