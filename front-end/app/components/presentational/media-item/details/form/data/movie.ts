import { ObjectSchema, array, number, object, string } from 'yup';
import { applyNormalizedTextArrayField, mediaItemFormValidationShape, normalizeMediaItemFormValues } from './media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';

/**
 * The movie form validation schema shape
 */
const movieFormValidationShape = {
	...mediaItemFormValidationShape,
	directors: array().of(string()).optional(),
	durationMinutes: number()
};

/**
 * The movie form validation schema
 */
export const movieFormValidationSchema = object().required().shape(movieFormValidationShape) as ObjectSchema<MovieInternal>;

/**
 * Normalizes movie-specific form values before save
 * @param values current form values
 * @returns normalized values
 */
export const normalizeMovieFormValues = (values: MovieInternal): MovieInternal => {
	const normalizedValues = normalizeMediaItemFormValues(values);

	applyNormalizedTextArrayField(normalizedValues, 'directors', values.directors);
	return normalizedValues;
};
