import { ObjectSchema, mixed, object, string } from 'yup';
import { CategoryInternal, MEDIA_TYPES_INTERNAL, MediaTypeInternal } from 'app/data/models/internal/category';

/**
 * The category form validation schema
 */
export const categoryFormValidationSchema: ObjectSchema<CategoryInternal> = object().required().shape({
	id: string(),
	name: string().required(),
	mediaType: mixed<MediaTypeInternal>().oneOf(MEDIA_TYPES_INTERNAL).required(),
	color: string().required()
});
