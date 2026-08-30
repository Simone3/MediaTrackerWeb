import { ObjectSchema, object, string } from 'yup';
import { GroupInternal } from 'app/data/models/internal/group';
import { i18n } from 'app/utilities/i18n';

/**
 * The group form validation schema
 */
export const groupFormValidationSchema: ObjectSchema<GroupInternal> = object().required().shape({
	id: string(),
	name: string().required(i18n.t('common.validation.required'))
});
