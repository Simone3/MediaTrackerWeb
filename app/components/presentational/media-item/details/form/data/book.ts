import { ObjectSchema, array, number, object, string } from 'yup';
import { applyNormalizedTextArrayField, mediaItemFormValidationShape, normalizeMediaItemFormValues } from './media-item';
import { BookInternal } from 'app/data/models/internal/media-items/book';

/**
 * The book form validation schema shape
 */
const bookFormValidationShape = {
	...mediaItemFormValidationShape,
	authors: array().of(string()).optional(),
	pagesNumber: number()
};

/**
 * The book form validation schema
 */
export const bookFormValidationSchema = object().required().shape(bookFormValidationShape) as ObjectSchema<BookInternal>;

/**
 * Normalizes book-specific form values before save
 * @param values current form values
 * @returns normalized values
 */
export const normalizeBookFormValues = (values: BookInternal): BookInternal => {
	const normalizedValues = normalizeMediaItemFormValues(values);

	applyNormalizedTextArrayField(normalizedValues, 'authors', values.authors);
	return normalizedValues;
};
