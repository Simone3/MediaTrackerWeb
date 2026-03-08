import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformIconInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { ObjectSchema, StringSchema, mixed, object, string } from 'yup';

/**
 * The own platform form validation schema
 */
export const ownPlatformFormValidationSchema: ObjectSchema<OwnPlatformInternal> = object().required().shape({
	id: string() as StringSchema<string>,
	name: string().required(),
	color: string().required(),
	icon: mixed<OwnPlatformIconInternal>().oneOf(OWN_PLATFORM_ICON_INTERNAL_VALUES).required()
});
