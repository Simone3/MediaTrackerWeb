import { GroupInternal } from 'app/data/models/internal/group';
import { object, ObjectSchema, string, StringSchema } from 'yup';

/**
 * The group form validation schema
 */
export const groupFormValidationSchema: ObjectSchema<GroupInternal> = object().required().shape({
	id: string() as StringSchema<string>,
	name: string().required()
});
