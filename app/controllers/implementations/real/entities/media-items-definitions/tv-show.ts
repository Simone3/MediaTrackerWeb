import { MediaItemDefinitionsController } from 'app/controllers/interfaces/entities/media-items/media-item';
import { DEFAULT_TV_SHOW, TvShowFilterInternal, TvShowInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Shared implementation of the TV show definitions controller
 */
export class TvShowDefinitionsControllerImpl implements MediaItemDefinitionsController<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal> {

	/**
	 * @override
	 */
	public getDefaultFilter(): TvShowFilterInternal {
		return {
			status: 'CURRENT'
		};
	}

	/**
	 * @override
	 */
	public getDefaultSortBy(): TvShowSortByInternal[] {
		return [{
			field: 'ACTIVE',
			ascending: false
		}, {
			field: 'IMPORTANCE',
			ascending: false
		}, {
			field: 'RELEASE_DATE',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	public getViewGroupSortBy(): TvShowSortByInternal[] {
		return [{
			field: 'GROUP',
			ascending: true
		}];
	}

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
