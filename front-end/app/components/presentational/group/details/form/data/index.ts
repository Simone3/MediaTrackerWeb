import { ObjectSchema, object, string } from 'yup';
import { GroupInternal } from 'app/data/models/internal/group';
import { i18n } from 'app/utilities/i18n';

/**
 * The group form validation schema.
 *
 * `id` is optional here, where the internal model has it required, because Formik blanks empty strings before it
 * validates: a new entity carries an empty id, which reaches the schema as undefined rather than as ''
 */
export const groupFormValidationSchema: ObjectSchema<Omit<GroupInternal, 'id'> & { id?: string }> = object().required().shape({
	id: string(),
	name: string().required(i18n.t('common.validation.required'))
});
