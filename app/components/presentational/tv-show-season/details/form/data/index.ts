import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { number, object, ObjectSchema } from 'yup';

/**
 * The TV show season form validation schema
 */
export const tvShowSeasonValidationSchema: ObjectSchema<TvShowSeasonInternal> = object().required().shape({
	number: number().required(),
	episodesNumber: number().optional(),
	watchedEpisodesNumber: number().optional()
});
