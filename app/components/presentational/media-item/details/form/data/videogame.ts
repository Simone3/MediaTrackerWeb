import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { ObjectSchema, array, number, object, string } from 'yup';
import { applyNormalizedTextArrayField, mediaItemFormValidationShape, normalizeMediaItemFormValues } from './media-item';

/**
 * The videogame form validation schema shape
 */
const videogameFormValidationShape = {
	...mediaItemFormValidationShape,
	developers: array().of(string().required()).optional(),
	publishers: array().of(string().required()).optional(),
	platforms: array().of(string().required()).optional(),
	averageLengthHours: number()
};

/**
 * The videogame form validation schema
 */
export const videogameFormValidationSchema = object().required().shape(videogameFormValidationShape) as ObjectSchema<VideogameInternal>;

/**
 * Normalizes videogame-specific form values before save
 * @param values current form values
 * @returns normalized values
 */
export const normalizeVideogameFormValues = (values: VideogameInternal): VideogameInternal => {
	const normalizedValues = normalizeMediaItemFormValues(values);

	applyNormalizedTextArrayField(normalizedValues, 'developers', values.developers);
	applyNormalizedTextArrayField(normalizedValues, 'publishers', values.publishers);
	applyNormalizedTextArrayField(normalizedValues, 'platforms', values.platforms);
	return normalizedValues;
};
