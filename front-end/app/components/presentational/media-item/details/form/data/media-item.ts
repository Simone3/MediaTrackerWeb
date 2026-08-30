import { NumberSchema, ObjectSchema, array, boolean, date, mixed, number, object, string } from 'yup';
import { MEDIA_TYPES_INTERNAL, MediaTypeInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MEDIA_ITEM_ORDER_IN_GROUP_INTERNAL_MAX, MEDIA_ITEM_ORDER_IN_GROUP_INTERNAL_MAX_DECIMALS, MEDIA_ITEM_STATUS_INTERNAL_VALUES, MediaItemImportanceInternal, MediaItemInternal, MediaItemStatusInternal } from 'app/data/models/internal/media-items/media-item';
import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformIconInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';

/**
 * Checks that a number does not carry more decimal digits than the group order allows
 * @param value the current value
 * @returns whether the value fits in the allowed number of decimal digits
 */
const hasAllowedOrderInGroupDecimals = (value: number | undefined): boolean => {
	if(value === undefined || Number.isNaN(value)) {
		return true;
	}

	return Number(value.toFixed(MEDIA_ITEM_ORDER_IN_GROUP_INTERNAL_MAX_DECIMALS)) === value;
};

/**
 * The generic media item form validation schema shape
 */
export const mediaItemFormValidationShape = {
	id: string(),
	name: string().required(),
	genres: array().of(string()).optional(),
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
	orderInGroup: number()
		.positive()
		.max(MEDIA_ITEM_ORDER_IN_GROUP_INTERNAL_MAX)
		.test('order-in-group-decimals', 'Too many decimal digits', hasAllowedOrderInGroupDecimals)
		.when('group', ([ value ]: (GroupInternal | undefined)[], schema: NumberSchema<number | undefined>) => {
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

/**
 * Trims and filters an optional text array
 * @param values array values
 * @returns normalized array or undefined
 */
const normalizeTextArray = (values?: string[]): string[] | undefined => {
	if(!values || values.length === 0) {
		return undefined;
	}

	const normalizedValues = values
		.map((value) => {
			return value.trim();
		})
		.filter((value) => {
			return value.length > 0;
		});

	return normalizedValues.length > 0 ? normalizedValues : undefined;
};

/**
 * Applies a normalized string array only when needed
 * @param target target object
 * @param key target key
 * @param values original values
 */
export const applyNormalizedTextArrayField = <T extends object>(
	target: T,
	key: keyof T,
	values: string[] | undefined
): void => {
	const mutableTarget = target as Record<string, unknown>;
	const normalizedValues = normalizeTextArray(values);

	if(normalizedValues) {
		mutableTarget[key as string] = normalizedValues;
	}
	else {
		delete mutableTarget[key as string];
	}
};

/**
 * Normalizes the current form values before save
 * @param values current form values
 * @returns normalized values
 */
export const normalizeMediaItemFormValues = <T extends MediaItemInternal>(values: T): T => {
	const normalizedValues: T = {
		...values
	};

	if(values.group?.id) {
		normalizedValues.orderInGroup = values.orderInGroup;
	}
	else {
		delete normalizedValues.orderInGroup;
	}

	applyNormalizedTextArrayField(normalizedValues, 'genres', values.genres);

	return normalizedValues;
};
