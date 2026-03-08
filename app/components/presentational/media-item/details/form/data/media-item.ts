import { MEDIA_TYPES_INTERNAL, MediaTypeInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MEDIA_ITEM_STATUS_INTERNAL_VALUES, MediaItemImportanceInternal, MediaItemStatusInternal } from 'app/data/models/internal/media-items/media-item';
import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformIconInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { NumberSchema, ObjectSchema, StringSchema, array, boolean, date, mixed, number, object, string } from 'yup';

/**
 * The generic media item form validation schema shape
 */
export const mediaItemFormValidationShape = {
	id: string() as StringSchema<string>,
	name: string().required(),
	genres: array().of(string().required()).optional(),
	description: string(),
	releaseDate: date(),
	imageUrl: string(),
	mediaType: mixed<MediaTypeInternal>().oneOf(MEDIA_TYPES_INTERNAL).required(),
	status: mixed<MediaItemStatusInternal>().oneOf(MEDIA_ITEM_STATUS_INTERNAL_VALUES).required(),
	importance: mixed<MediaItemImportanceInternal>().oneOf(MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES).required(),
	group: object({
		id: string(),
		name: string()
	}) as ObjectSchema<GroupInternal | undefined>,
	orderInGroup: number().when('group', ([ value ]: (GroupInternal | undefined)[], schema: NumberSchema<number | undefined>) => {
		
		return value && value.id ? schema.required() : schema;
	}),
	ownPlatform: object({
		id: string(),
		name: string(),
		color: string(),
		icon: mixed<OwnPlatformIconInternal>().oneOf(OWN_PLATFORM_ICON_INTERNAL_VALUES)
	}) as ObjectSchema<OwnPlatformInternal | undefined>,
	userComment: string(),
	completedOn: array().of(date().required()).optional(),
	active: boolean(),
	markedAsRedo: boolean(),
	catalogId: string()
};
