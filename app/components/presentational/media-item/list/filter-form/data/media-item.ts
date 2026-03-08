import { MediaItemGroupFilter, MediaItemOwnPlatformFilter } from 'app/data/models/api/media-items/media-item';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemFilterInternal, MediaItemGroupFilterInternal, MediaItemImportanceInternal, MediaItemOwnPlatformFilterInternal, MediaItemSortByInternal, MediaItemStatusFilterInternal, MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES } from 'app/data/models/internal/media-items/media-item';
import { ValuesOf } from 'app/utilities/helper-types';
import { mixed } from 'yup';

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

/**
 * The generic media item filter form validation shape
 */
export const mediaItemFilterFormValidationShape = {
	status: mixed<MediaItemFilterFormStatus>().oneOf(MEDIA_ITEM_FILTER_FORM_STATUS_VALUES).required(),
	importanceLevel: mixed<MediaItemFilterFormImportance>().oneOf(MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES).required(),
	group: mixed<MediaItemFilterFormGroup>().oneOf(MEDIA_ITEM_FILTER_FORM_GROUP_VALUES).required(),
	ownPlatform: mixed<MediaItemFilterFormOwnPlatform>().oneOf(MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES).required(),
	sortBy: mixed<MediaItemFilterFormSortBy>().oneOf(MEDIA_ITEM_FILTER_FORM_SORT_VALUES).required()
};

/**
 * Mapper for the media item filter form values
 */
export abstract class MediaItemFilterFormMapper<TMediaItemFilterInternal extends MediaItemFilterInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterFormValues extends MediaItemFilterFormValues> {
	
	/**
	 * Mapping
	 * @param filter the filter model
	 * @param sortBy the sort by model
	 * @returns the form values
	 */
	public abstract toFormValues(filter: TMediaItemFilterInternal, sortBy: TMediaItemSortByInternal[]): TMediaItemFilterFormValues;

	/**
	 * Mapping
	 * @param formValues the form values
	 * @returns the filter model
	 */
	public abstract toFilterModel(formValues: TMediaItemFilterFormValues): TMediaItemFilterInternal;
	
	/**
	 * Common mapping
	 * @param filter the filter model
	 * @returns the form values
	 */
	protected toCommonFormValues(filter: MediaItemFilterInternal): MediaItemFilterFormValues {
		
		return {
			importanceLevel: this.toImportanceFormValue(filter.importanceLevels),
			group: this.toGroupFormValue(filter.groups),
			ownPlatform: this.toOwnPlatformFormValue(filter.ownPlatforms),
			status: this.toStatusFormValue(filter.status),
			sortBy: 'DEFAULT'
		};
	}

	/**
	 * Common mapping
	 * @param formValues the form values
	 * @returns the filter model
	 */
	protected toCommonFilterModel(formValues: MediaItemFilterFormValues): MediaItemFilterInternal {
		
		return {
			importanceLevels: this.toImportanceModel(formValues.importanceLevel),
			groups: this.toGroupModel(formValues.group),
			ownPlatforms: this.toOwnPlatformModel(formValues.ownPlatform),
			status: this.toStatusModel(formValues.status)
		};
	}

	/**
	 * Mapping
	 * @param formValues the form values
	 * @returns the sort by model
	 */
	public abstract toSortByModel(formValues: TMediaItemFilterFormValues): TMediaItemSortByInternal[];

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toImportanceFormValue(source: MediaItemImportanceInternal[] | undefined): MediaItemFilterFormImportance {

		return source && source.length > 0 ? source[0] : 'NONE';
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toGroupFormValue(source: MediaItemGroupFilterInternal | undefined): MediaItemFilterFormGroup {

		if(source) {

			if(source.anyGroup) {
				
				return 'ANY';
			}
			else if(source.noGroup) {

				return 'NONE';
			}
		}

		return 'ALL';
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toOwnPlatformFormValue(source: MediaItemOwnPlatformFilterInternal | undefined): MediaItemFilterFormOwnPlatform {

		if(source) {

			if(source.anyOwnPlatform) {
				
				return 'ANY';
			}
			else if(source.noOwnPlatform) {

				return 'NONE';
			}
		}

		return 'ALL';
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toStatusFormValue(source: MediaItemStatusFilterInternal | undefined): MediaItemFilterFormStatus {

		if(source === 'COMPLETE') {

			return 'COMPLETE';
		}
		else if(source === 'CURRENT') {

			return 'CURRENT';
		}
		else {

			return 'ALL';
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toImportanceModel(source: MediaItemFilterFormImportance): MediaItemImportanceInternal[] | undefined {

		return source === 'NONE' ? undefined : [ source ];
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toGroupModel(source: MediaItemFilterFormGroup): MediaItemGroupFilter | undefined {
		
		switch(source) {

			case 'ALL':
				return undefined;

			case 'ANY':
				return {
					anyGroup: true
				};

			case 'NONE':
				return {
					noGroup: true
				};

			default:
				throw AppError.GENERIC.withDetails(`Cannot map group filter ${source}`);
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toOwnPlatformModel(source: MediaItemFilterFormOwnPlatform): MediaItemOwnPlatformFilter | undefined {
		
		switch(source) {

			case 'ALL':
				return undefined;

			case 'ANY':
				return {
					anyOwnPlatform: true
				};

			case 'NONE':
				return {
					noOwnPlatform: true
				};

			default:
				throw AppError.GENERIC.withDetails(`Cannot map own platform filter ${source}`);
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toStatusModel(source: MediaItemFilterFormStatus): MediaItemStatusFilterInternal | undefined {
		
		switch(source) {

			case 'ALL':
				return undefined;
			
			case 'COMPLETE':
				return 'COMPLETE';

			case 'CURRENT':
				return 'CURRENT';

			default:
				throw AppError.GENERIC.withDetails(`Cannot map status filter ${source}`);
		}
	}
}
