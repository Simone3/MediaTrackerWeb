import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { ObjectSchema, array, number, object, string } from 'yup';
import { mediaItemFormValidationShape } from './media-item';

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
