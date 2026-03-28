import { MediaItemImportanceInternal, MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES } from 'app/data/models/internal/media-items/media-item';
import { ValuesOf } from 'app/utilities/helper-types';

/**
 * The generic media item filter form model
 */
export type MediaItemFilterFormValues = {
	status: MediaItemFilterFormStatus;
	importanceLevel: MediaItemFilterFormImportance;
	group: MediaItemFilterFormGroup;
	ownPlatform: MediaItemFilterFormOwnPlatform;
	sortBy: MediaItemFilterFormSortBy;
}

/**
 * Array of all generic media item status filter options
 */
export const MEDIA_ITEM_FILTER_FORM_STATUS_VALUES: [ 'ALL', 'CURRENT', 'COMPLETE' ] = [ 'ALL', 'CURRENT', 'COMPLETE' ];

/**
 * The generic media item status filter options
 */
export type MediaItemFilterFormStatus = ValuesOf<typeof MEDIA_ITEM_FILTER_FORM_STATUS_VALUES>;

/**
 * Array of all generic media item importance filter options
 */
export const MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES: MediaItemFilterFormImportance[] = [ 'NONE', ...MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES ];

/**
 * The generic media item importance filter options
 */
export type MediaItemFilterFormImportance = 'NONE' | MediaItemImportanceInternal;

/**
 * Array of all generic media item group filter options
 */
export const MEDIA_ITEM_FILTER_FORM_GROUP_VALUES: [ 'ALL', 'ANY', 'NONE' ] = [ 'ALL', 'ANY', 'NONE' ];

/**
 * The generic media item group filter options
 */
export type MediaItemFilterFormGroup = ValuesOf<typeof MEDIA_ITEM_FILTER_FORM_GROUP_VALUES>;

/**
 * Array of all generic media item own platform filter options
 */
export const MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES: [ 'ALL', 'ANY', 'NONE' ] = [ 'ALL', 'ANY', 'NONE' ];

/**
 * The generic media item own platform filter options
 */
export type MediaItemFilterFormOwnPlatform = ValuesOf<typeof MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES>;

/**
 * Array of all generic media item sort by options
 */
export const MEDIA_ITEM_FILTER_FORM_SORT_VALUES: [ 'DEFAULT', 'NAME', 'COMPLETION_DATE' ] = [ 'DEFAULT', 'NAME', 'COMPLETION_DATE' ];

/**
 * The generic media item sort by options
 */
export type MediaItemFilterFormSortBy = ValuesOf<typeof MEDIA_ITEM_FILTER_FORM_SORT_VALUES>;
