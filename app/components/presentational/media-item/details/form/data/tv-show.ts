import { TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { NumberSchema, ObjectSchema, array, boolean, date, number, object, string } from 'yup';
import { mediaItemFormValidationShape } from './media-item';

/**
 * The TV show form validation schema shape
 */
const tvShowSeasonFormValidationSchema: ObjectSchema<TvShowSeasonInternal> = object().shape({
	number: number().optional() as NumberSchema<number>,
	episodesNumber: number().optional(),
	watchedEpisodesNumber: number().optional()
});

/**
 * The TV show form validation schema shape
 */
const tvShowFormValidationShape = {
	...mediaItemFormValidationShape,
	creators: array().of(string().required()).optional(),
	averageEpisodeRuntimeMinutes: number(),
	seasons: array().of(tvShowSeasonFormValidationSchema).optional(),
	inProduction: boolean(),
	nextEpisodeAirDate: date()
};

/**
 * The TV show form validation schema
 */
export const tvShowFormValidationSchema: ObjectSchema<TvShowInternal> = object().required().shape(tvShowFormValidationShape);
