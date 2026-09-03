import { ObjectSchema, mixed, object, string } from 'yup';
import { CategoryInternal, MEDIA_TYPES_INTERNAL, MediaTypeInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

/**
 * The category form validation schema.
 *
 * `id` is optional here, where the internal model has it required, because Formik blanks empty strings before it
 * validates: a new entity carries an empty id, which reaches the schema as undefined rather than as ''
 */
export const categoryFormValidationSchema: ObjectSchema<Omit<CategoryInternal, 'id'> & { id?: string }> = object().required().shape({
	id: string(),
	name: string().required(i18n.t('common.validation.required')),
	mediaType: mixed<MediaTypeInternal>().oneOf(MEDIA_TYPES_INTERNAL).required(),
	color: string().required()
});
