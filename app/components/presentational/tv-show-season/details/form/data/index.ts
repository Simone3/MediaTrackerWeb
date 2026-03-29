import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { ObjectSchema, number, object } from 'yup';

/**
 * The TV show season form validation schema
 */
export const tvShowSeasonValidationSchema: ObjectSchema<TvShowSeasonInternal> = object().required().shape({
	number: number().required(),
	episodesNumber: number().optional(),
	watchedEpisodesNumber: number().optional()
});
