import { CategoryInternal, MEDIA_TYPES_INTERNAL, MediaTypeInternal } from 'app/data/models/internal/category';
import { ObjectSchema, StringSchema, mixed, object, string } from 'yup';

/**
 * The category form validation schema
 */
export const categoryFormValidationSchema: ObjectSchema<CategoryInternal> = object().required().shape({
	id: string() as StringSchema<string>,
	name: string().required(),
	mediaType: mixed<MediaTypeInternal>().oneOf(MEDIA_TYPES_INTERNAL).required(),
	color: string().required()
});
