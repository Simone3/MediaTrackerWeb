import { NumberSchema, ObjectSchema, array, boolean, date, number, object, string } from 'yup';
import { applyNormalizedTextArrayField, mediaItemFormValidationShape, normalizeMediaItemFormValues } from './media-item';
import { TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * The TV show season form validation schema
 */
const tvShowSeasonFormValidationSchema: ObjectSchema<TvShowSeasonInternal> = object().shape({
	number: number().optional(),
	episodesNumber: number().optional(),
	watchedEpisodesNumber: number().when('episodesNumber', ([ episodesNumber ]: (number | undefined)[], schema: NumberSchema<number | undefined>) => {
		if(episodesNumber === undefined) {
			return schema;
		}

		return schema.max(episodesNumber);
	})
});

/**
 * The TV show form validation schema shape
 */
const tvShowFormValidationShape = {
	...mediaItemFormValidationShape,
	creators: array().of(string()).optional(),
	averageEpisodeRuntimeMinutes: number(),
	seasons: array().of(tvShowSeasonFormValidationSchema).optional(),
	inProduction: boolean(),
	nextEpisodeAirDate: date()
};

/**
 * The TV show form validation schema
 */
export const tvShowFormValidationSchema = object().required().shape(tvShowFormValidationShape) as ObjectSchema<TvShowInternal>;

/**
 * Normalizes TV show-specific form values before save
 * @param values current form values
 * @returns normalized values
 */
export const normalizeTvShowFormValues = (values: TvShowInternal): TvShowInternal => {
	const normalizedValues = normalizeMediaItemFormValues(values);

	applyNormalizedTextArrayField(normalizedValues, 'creators', values.creators);
	return normalizedValues;
};

/**
 * Preserves watched-episodes progress when catalog seasons are reloaded
 * @param currentValues current form values
 * @param mergedValues merged values after catalog reload
 * @returns merged values with preserved watched progress
 */
export const preserveTvShowSeasonProgress = (currentValues: TvShowInternal, mergedValues: TvShowInternal): TvShowInternal => {
	const currentSeasons = currentValues.seasons;
	const newSeasons = mergedValues.seasons;

	if(!newSeasons || newSeasons.length === 0 || !currentSeasons || currentSeasons.length === 0) {
		return mergedValues;
	}

	return {
		...mergedValues,
		seasons: newSeasons.map((newSeason) => {
			const currentSeason = currentSeasons.find((season) => {
				return season.number === newSeason.number;
			});

			if(!currentSeason) {
				return newSeason;
			}

			return {
				...newSeason,
				watchedEpisodesNumber: currentSeason.watchedEpisodesNumber
			};
		})
	};
};
