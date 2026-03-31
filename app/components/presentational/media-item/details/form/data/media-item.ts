import { MEDIA_TYPES_INTERNAL, MediaTypeInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { DEFAULT_CATALOG_BOOK, BookInternal } from 'app/data/models/internal/media-items/book';
import { CatalogMediaItemInternal, MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MEDIA_ITEM_STATUS_INTERNAL_VALUES, MediaItemImportanceInternal, MediaItemInternal, MediaItemStatusInternal } from 'app/data/models/internal/media-items/media-item';
import { DEFAULT_CATALOG_MOVIE, MovieInternal } from 'app/data/models/internal/media-items/movie';
import { DEFAULT_CATALOG_TV_SHOW, TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { DEFAULT_CATALOG_VIDEOGAME, VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformIconInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { NumberSchema, ObjectSchema, array, boolean, date, mixed, number, object, string } from 'yup';

/**
 * Unified media item details form values across all media types
 */
export type MediaItemDetailsFormValues = MediaItemInternal & Partial<BookInternal & MovieInternal & TvShowInternal & VideogameInternal>;

/**
 * The generic media item form validation schema shape
 */
export const mediaItemFormValidationShape = {
	id: string(),
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
const applyNormalizedTextArray = (
	target: MediaItemDetailsFormValues,
	key: keyof MediaItemDetailsFormValues,
	values: string[] | undefined
): void => {
	const mutableTarget = target as Record<string, unknown>;
	const normalizedValues = normalizeTextArray(values);

	if(normalizedValues) {
		mutableTarget[key] = normalizedValues;
	}
	else {
		delete mutableTarget[key];
	}
};

/**
 * Returns the empty catalog-linked fields for the active media type
 * @param mediaType current media type
 * @returns default catalog details
 */
export const getDefaultCatalogMediaItem = (mediaType: MediaTypeInternal): CatalogMediaItemInternal => {
	switch(mediaType) {
		case 'BOOK':
			return DEFAULT_CATALOG_BOOK;

		case 'MOVIE':
			return DEFAULT_CATALOG_MOVIE;

		case 'TV_SHOW':
			return DEFAULT_CATALOG_TV_SHOW;

		case 'VIDEOGAME':
			return DEFAULT_CATALOG_VIDEOGAME;

		default:
			return DEFAULT_CATALOG_BOOK;
	}
};

/**
 * Merges catalog details into the current form values
 * @param currentValues current form values
 * @param catalogDetails latest catalog details
 * @returns merged values
 */
export const mergeCatalogDetailsIntoMediaItem = (
	currentValues: MediaItemDetailsFormValues,
	catalogDetails: CatalogMediaItemInternal
): MediaItemDetailsFormValues => {
	const mergedValues: MediaItemDetailsFormValues = {
		...currentValues,
		...getDefaultCatalogMediaItem(currentValues.mediaType),
		...catalogDetails
	};

	if(currentValues.mediaType === 'TV_SHOW') {
		const currentTvShow = currentValues as TvShowInternal;
		const mergedTvShow = mergedValues as TvShowInternal;
		const currentSeasons = currentTvShow.seasons;
		const newSeasons = mergedTvShow.seasons;

		if(newSeasons && newSeasons.length > 0 && currentSeasons && currentSeasons.length > 0) {
			for(const newSeason of newSeasons) {
				const currentSeason = currentSeasons.find((season) => {
					return season.number === newSeason.number;
				});

				if(currentSeason) {
					newSeason.watchedEpisodesNumber = currentSeason.watchedEpisodesNumber;
				}
			}
		}
	}

	return mergedValues;
};

/**
 * Normalizes the current form values before save
 * @param values current form values
 * @returns normalized values
 */
export const normalizeMediaItemDetailsFormValues = (values: MediaItemDetailsFormValues): MediaItemDetailsFormValues => {
	const normalizedValues: MediaItemDetailsFormValues = {
		...values
	};

	if(values.group?.id) {
		normalizedValues.orderInGroup = values.orderInGroup;
	}
	else {
		delete normalizedValues.orderInGroup;
	}

	applyNormalizedTextArray(normalizedValues, 'genres', values.genres);
	applyNormalizedTextArray(normalizedValues, 'authors', values.authors);
	applyNormalizedTextArray(normalizedValues, 'directors', values.directors);
	applyNormalizedTextArray(normalizedValues, 'creators', values.creators);
	applyNormalizedTextArray(normalizedValues, 'developers', values.developers);
	applyNormalizedTextArray(normalizedValues, 'publishers', values.publishers);
	applyNormalizedTextArray(normalizedValues, 'platforms', values.platforms);

	return normalizedValues;
};
