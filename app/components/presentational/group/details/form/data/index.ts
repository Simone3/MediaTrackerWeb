import { GroupInternal } from 'app/data/models/internal/group';
import { ObjectSchema, object, string } from 'yup';

/**
 * The group form validation schema
 */
export const groupFormValidationSchema: ObjectSchema<GroupInternal> = object().required().shape({
	id: string(),
	name: string().required()
});
