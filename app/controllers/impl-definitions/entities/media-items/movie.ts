import { MediaItemDefinitionsController } from 'app/controllers/core/entities/media-items/media-item';
import { DEFAULT_MOVIE, MovieFilterInternal, MovieInternal, MovieSortByInternal } from 'app/data/models/internal/media-items/movie';

/**
 * Shared implementation of the Movie definitions controller
 */
export class MovieDefinitionsControllerImpl implements MediaItemDefinitionsController<MovieInternal, MovieSortByInternal, MovieFilterInternal> {

	/**
	 * @override
	 */
	public getDefaultFilter(): MovieFilterInternal {
		return {
			status: 'CURRENT'
		};
	}

	/**
	 * @override
	 */
	public getDefaultSortBy(): MovieSortByInternal[] {
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
	public getViewGroupSortBy(): MovieSortByInternal[] {
		return [{
			field: 'GROUP',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	public getCreatorNames(mediaItem: MovieInternal): string[] | undefined {
		return mediaItem.directors;
	}

	/**
	 * @override
	 */
	public getDurationValue(mediaItem: MovieInternal): number | undefined {
		return mediaItem.durationMinutes;
	}

	/**
	 * @override
	 */
	public getDefaultMediaItem(): MovieInternal {
		return DEFAULT_MOVIE;
	}
}
