import { FormikErrors } from 'formik';
import { CategoryInternal, MEDIA_TYPES_INTERNAL } from 'app/data/models/internal/category';

/**
 * Validates the category form values
 * @param values the current category form values
 * @returns the field validation errors
 */
export const validateCategoryForm = (values: CategoryInternal): FormikErrors<CategoryInternal> => {
	const errors: FormikErrors<CategoryInternal> = {};

	if(!values.name.trim()) {
		errors.name = 'Required';
	}

	if(!MEDIA_TYPES_INTERNAL.includes(values.mediaType)) {
		errors.mediaType = 'Required';
	}

	if(!values.color.trim()) {
		errors.color = 'Required';
	}

	return errors;
};
