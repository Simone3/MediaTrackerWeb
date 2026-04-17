import { NumberSchema, ObjectSchema, number, object } from 'yup';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * The TV show season form validation schema
 */
export const tvShowSeasonValidationSchema: ObjectSchema<TvShowSeasonInternal> = object().required().shape({
	number: number().required(),
	episodesNumber: number().optional(),
	watchedEpisodesNumber: number().when('episodesNumber', ([ episodesNumber ]: (number | undefined)[], schema: NumberSchema<number | undefined>) => {
		if(episodesNumber === undefined) {
			return schema;
		}

		return schema.max(episodesNumber);
	})
});
