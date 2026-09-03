import { ObjectSchema, mixed, object, string } from 'yup';
import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformIconInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

/**
 * The own platform form validation schema.
 *
 * `id` is optional here, where the internal model has it required, because Formik blanks empty strings before it
 * validates: a new entity carries an empty id, which reaches the schema as undefined rather than as ''
 */
export const ownPlatformFormValidationSchema: ObjectSchema<Omit<OwnPlatformInternal, 'id'> & { id?: string }> = object().required().shape({
	id: string(),
	name: string().required(i18n.t('common.validation.required')),
	color: string().required(),
	icon: mixed<OwnPlatformIconInternal>().oneOf(OWN_PLATFORM_ICON_INTERNAL_VALUES).required()
});
