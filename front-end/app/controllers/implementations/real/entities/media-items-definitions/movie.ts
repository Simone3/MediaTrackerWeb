import { MediaItemDefinitionsControllerImpl } from 'app/controllers/implementations/real/entities/media-items-definitions/media-item';
import { MovieDefinitionsController } from 'app/controllers/interfaces/entities/media-items/movie';
import { DEFAULT_MOVIE, MovieFilterInternal, MovieInternal, MovieSortByInternal } from 'app/data/models/internal/media-items/movie';

/**
 * Shared implementation of the Movie definitions controller
 */
export class MovieDefinitionsControllerImpl extends MediaItemDefinitionsControllerImpl<MovieInternal, MovieSortByInternal, MovieFilterInternal> implements MovieDefinitionsController {
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
