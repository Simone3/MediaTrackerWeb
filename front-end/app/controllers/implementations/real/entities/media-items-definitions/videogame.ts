import { MediaItemDefinitionsControllerImpl } from 'app/controllers/implementations/real/entities/media-items-definitions/media-item';
import { VideogameDefinitionsController } from 'app/controllers/interfaces/entities/media-items/videogame';
import { DEFAULT_VIDEOGAME, VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';

/**
 * Shared implementation of the Videogame definitions controller
 */
export class VideogameDefinitionsControllerImpl extends MediaItemDefinitionsControllerImpl<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal> implements VideogameDefinitionsController {
	/**
	 * @override
	 */
	public getCreatorNames(mediaItem: VideogameInternal): string[] | undefined {
		return mediaItem.developers;
	}

	/**
	 * @override
	 */
	public getDurationValue(mediaItem: VideogameInternal): number | undefined {
		return mediaItem.averageLengthHours;
	}

	/**
	 * @override
	 */
	public getDefaultMediaItem(): VideogameInternal {
		return DEFAULT_VIDEOGAME;
	}
}
