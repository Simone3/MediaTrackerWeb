import { BookInternal } from 'app/data/models/internal/media-items/book';
import { ObjectSchema, array, number, object, string } from 'yup';
import { mediaItemFormValidationShape } from './media-item';

/**
 * The book form validation schema shape
 */
const bookFormValidationShape = {
	...mediaItemFormValidationShape,
	authors: array().of(string().required()).optional(),
	pagesNumber: number()
};

/**
 * The book form validation schema
 */
export const bookFormValidationSchema = object().required().shape(bookFormValidationShape) as ObjectSchema<BookInternal>;
