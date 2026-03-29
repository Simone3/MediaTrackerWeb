import { TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { ObjectSchema, array, boolean, date, number, object, string } from 'yup';
import { mediaItemFormValidationShape } from './media-item';

/**
 * The TV show season form validation schema
 */
const tvShowSeasonFormValidationSchema: ObjectSchema<TvShowSeasonInternal> = object().shape({
	number: number().optional(),
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
export const tvShowFormValidationSchema = object().required().shape(tvShowFormValidationShape) as ObjectSchema<TvShowInternal>;
