import { mixed, string } from 'yup';
import { AppError } from 'app/data/models/internal/error';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemFilterInternal, MediaItemGroupFilterInternal, MediaItemImportanceInternal, MediaItemOwnPlatformFilterInternal, MediaItemSortByInternal, MediaItemStatusFilterInternal, MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { ValuesOf } from 'app/utilities/helper-types';
import { i18n } from 'app/utilities/i18n';

/**
 * The generic media item filter form model
 */
export type MediaItemFilterFormValues = {
	status: MediaItemFilterFormStatus;
	importanceLevel: MediaItemFilterFormImportance;
	group: MediaItemFilterFormGroup;
	ownPlatform: MediaItemFilterFormOwnPlatform;
	sortBy: MediaItemFilterFormSortBy;
};

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
 * Array of the media item group filter options that do not target a specific group
 */
export const MEDIA_ITEM_FILTER_FORM_GENERIC_GROUP_VALUES: [ 'ALL', 'ANY', 'NONE' ] = [ 'ALL', 'ANY', 'NONE' ];

/**
 * The media item group filter options that do not target a specific group
 */
export type MediaItemFilterFormGenericGroup = ValuesOf<typeof MEDIA_ITEM_FILTER_FORM_GENERIC_GROUP_VALUES>;

/**
 * The prefix that marks a group filter form value as a specific group ID, telling it apart from the generic options
 */
export const MEDIA_ITEM_FILTER_FORM_GROUP_ID_PREFIX = 'GROUP_ID_';

/**
 * The media item group filter options: one of the generic values, or the ID prefix followed by a specific group ID
 */
export type MediaItemFilterFormGroup = string;

/**
 * Array of the media item own platform filter options that do not target a specific own platform
 */
export const MEDIA_ITEM_FILTER_FORM_GENERIC_OWN_PLATFORM_VALUES: [ 'ALL', 'ANY', 'NONE' ] = [ 'ALL', 'ANY', 'NONE' ];

/**
 * The media item own platform filter options that do not target a specific own platform
 */
export type MediaItemFilterFormGenericOwnPlatform = ValuesOf<typeof MEDIA_ITEM_FILTER_FORM_GENERIC_OWN_PLATFORM_VALUES>;

/**
 * The prefix that marks an own platform filter form value as a specific own platform ID, telling it apart from the generic options
 */
export const MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_ID_PREFIX = 'OWN_PLATFORM_ID_';

/**
 * The media item own platform filter options: one of the generic values, or the ID prefix followed by a specific own platform ID
 */
export type MediaItemFilterFormOwnPlatform = string;

/**
 * A single option of one of the filter form select inputs
 */
export type MediaItemFilterFormOption = {

	/**
	 * The form value the option sets
	 */
	value: string;

	/**
	 * The user-readable option label
	 */
	label: string;
};

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
	group: string().required(),
	ownPlatform: string().required(),
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
			// Specific IDs win over the generic options, just like they do in the back-end query
			if(source.groupIds && source.groupIds.length > 0) {
				return `${MEDIA_ITEM_FILTER_FORM_GROUP_ID_PREFIX}${source.groupIds[0]}`;
			}
			if(source.anyGroup) {
				return 'ANY';
			}
			if(source.noGroup) {
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
			// Specific IDs win over the generic options, just like they do in the back-end query
			if(source.ownPlatformIds && source.ownPlatformIds.length > 0) {
				return `${MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_ID_PREFIX}${source.ownPlatformIds[0]}`;
			}
			if(source.anyOwnPlatform) {
				return 'ANY';
			}
			if(source.noOwnPlatform) {
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
		if(source === 'CURRENT') {
			return 'CURRENT';
		}

		return 'ALL';
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
	protected toGroupModel(source: MediaItemFilterFormGroup): MediaItemGroupFilterInternal | undefined {
		if(source.startsWith(MEDIA_ITEM_FILTER_FORM_GROUP_ID_PREFIX)) {
			// The display name is not known here: the modal fills it in from the loaded groups before the filter is submitted
			return {
				groupIds: [ source.substring(MEDIA_ITEM_FILTER_FORM_GROUP_ID_PREFIX.length) ]
			};
		}

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
				throw AppError.GENERIC.withDetails('Cannot map group filter');
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	protected toOwnPlatformModel(source: MediaItemFilterFormOwnPlatform): MediaItemOwnPlatformFilterInternal | undefined {
		if(source.startsWith(MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_ID_PREFIX)) {
			// The display name is not known here: the modal fills it in from the loaded own platforms before the filter is submitted
			return {
				ownPlatformIds: [ source.substring(MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_ID_PREFIX.length) ]
			};
		}

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
				throw AppError.GENERIC.withDetails('Cannot map own platform filter');
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
				throw AppError.GENERIC.withDetails('Cannot map status filter');
		}
	}
}

/**
 * Helper to look up the display name that the filter carries for one of its IDs
 * @param ids the filtered IDs
 * @param names the display names, in the same order as the IDs
 * @param id the ID to look up
 * @returns the display name, or undefined if the filter does not carry one
 */
const findFilterDisplayName = (ids: string[] | undefined, names: string[] | undefined, id: string): string | undefined => {
	if(!ids || !names) {
		return undefined;
	}

	const index = ids.indexOf(id);
	return index >= 0 ? names[index] : undefined;
};

/**
 * Helper to label the option of a filtered entity that the loaded list does not contain
 * @param name the display name the filter carries, if any
 * @param id the entity ID
 * @param listLoaded if the loaded list is the authoritative one, i.e. the fetch completed successfully
 * @param valuesKey the language bundle key of the filter values
 * @returns the option label
 */
const buildUnlistedOptionLabel = (name: string | undefined, id: string, listLoaded: boolean, valuesKey: string): string => {
	if(!name) {
		// Only the ID is known: the filter was built before the display names existed, or it was restored without one
		return i18n.t(`mediaItem.list.filter.values.${valuesKey}.unknown`, { id: id });
	}

	// A loaded list that does not contain the ID is authoritative: the entity is gone, and saying so explains an empty result list
	return listLoaded ? i18n.t(`mediaItem.list.filter.values.${valuesKey}.deleted`, { name: name }) : name;
};

/**
 * Builds the options of the group filter input: the generic ones, then one for each loaded group, then, if the filter targets a group the
 * loaded list does not contain, one that keeps the current selection both readable and reachable
 * @param filter the filter the form was initialized with
 * @param groups the currently loaded groups, empty while they are being fetched
 * @param groupsLoaded if the loaded groups are the authoritative list, i.e. the fetch completed successfully
 * @returns the select options
 */
export const buildGroupFilterOptions = (filter: MediaItemFilterInternal, groups: GroupInternal[], groupsLoaded: boolean): MediaItemFilterFormOption[] => {
	const options: MediaItemFilterFormOption[] = MEDIA_ITEM_FILTER_FORM_GENERIC_GROUP_VALUES.map((value) => {
		return {
			value: value,
			label: i18n.t(`mediaItem.list.filter.values.group.${value}`)
		};
	});

	for(const group of groups) {
		options.push({
			value: `${MEDIA_ITEM_FILTER_FORM_GROUP_ID_PREFIX}${group.id}`,
			label: group.name
		});
	}

	const groupsFilter = filter.groups;
	const selectedId = groupsFilter && groupsFilter.groupIds && groupsFilter.groupIds.length > 0 ? groupsFilter.groupIds[0] : undefined;
	if(selectedId && !groups.some((group) => {
		return group.id === selectedId;
	})) {
		options.push({
			value: `${MEDIA_ITEM_FILTER_FORM_GROUP_ID_PREFIX}${selectedId}`,
			label: buildUnlistedOptionLabel(findFilterDisplayName(groupsFilter.groupIds, groupsFilter.groupNames, selectedId), selectedId, groupsLoaded, 'group')
		});
	}

	return options;
};

/**
 * Builds the options of the own platform filter input: the generic ones, then one for each loaded own platform, then, if the filter targets
 * an own platform the loaded list does not contain, one that keeps the current selection both readable and reachable
 * @param filter the filter the form was initialized with
 * @param ownPlatforms the currently loaded own platforms, empty while they are being fetched
 * @param ownPlatformsLoaded if the loaded own platforms are the authoritative list, i.e. the fetch completed successfully
 * @returns the select options
 */
export const buildOwnPlatformFilterOptions = (filter: MediaItemFilterInternal, ownPlatforms: OwnPlatformInternal[], ownPlatformsLoaded: boolean): MediaItemFilterFormOption[] => {
	const options: MediaItemFilterFormOption[] = MEDIA_ITEM_FILTER_FORM_GENERIC_OWN_PLATFORM_VALUES.map((value) => {
		return {
			value: value,
			label: i18n.t(`mediaItem.list.filter.values.ownPlatform.${value}`)
		};
	});

	for(const ownPlatform of ownPlatforms) {
		options.push({
			value: `${MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_ID_PREFIX}${ownPlatform.id}`,
			label: ownPlatform.name
		});
	}

	const ownPlatformsFilter = filter.ownPlatforms;
	const selectedId = ownPlatformsFilter && ownPlatformsFilter.ownPlatformIds && ownPlatformsFilter.ownPlatformIds.length > 0 ? ownPlatformsFilter.ownPlatformIds[0] : undefined;
	if(selectedId && !ownPlatforms.some((ownPlatform) => {
		return ownPlatform.id === selectedId;
	})) {
		options.push({
			value: `${MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_ID_PREFIX}${selectedId}`,
			label: buildUnlistedOptionLabel(findFilterDisplayName(ownPlatformsFilter.ownPlatformIds, ownPlatformsFilter.ownPlatformNames, selectedId), selectedId, ownPlatformsLoaded, 'ownPlatform')
		});
	}

	return options;
};

/**
 * Fills in the display names of the groups and own platforms the given filter targets, so that the filter can label its own selection later
 * on, when the loaded lists may not be available. Names that cannot be resolved against the loaded lists are carried over from the previous
 * filter, which is what keeps a deleted group readable instead of turning it back into a bare ID
 * @param filter the filter to complete
 * @param previousFilter the filter the form was initialized with
 * @param groups the currently loaded groups
 * @param ownPlatforms the currently loaded own platforms
 * @returns the filter, with the display names of its groups and own platforms
 */
export const withFilterDisplayNames = (filter: MediaItemFilterInternal, previousFilter: MediaItemFilterInternal, groups: GroupInternal[], ownPlatforms: OwnPlatformInternal[]): MediaItemFilterInternal => {
	const result = {
		...filter
	};

	if(result.groups && result.groups.groupIds) {
		const previousGroups = previousFilter.groups;
		result.groups = {
			...result.groups,
			groupNames: result.groups.groupIds.map((id) => {
				const group = groups.find((currentGroup) => {
					return currentGroup.id === id;
				});

				return group ? group.name : findFilterDisplayName(previousGroups ? previousGroups.groupIds : undefined, previousGroups ? previousGroups.groupNames : undefined, id);
			})
		};
	}

	if(result.ownPlatforms && result.ownPlatforms.ownPlatformIds) {
		const previousOwnPlatforms = previousFilter.ownPlatforms;
		result.ownPlatforms = {
			...result.ownPlatforms,
			ownPlatformNames: result.ownPlatforms.ownPlatformIds.map((id) => {
				const ownPlatform = ownPlatforms.find((currentOwnPlatform) => {
					return currentOwnPlatform.id === id;
				});

				return ownPlatform ? ownPlatform.name : findFilterDisplayName(previousOwnPlatforms ? previousOwnPlatforms.ownPlatformIds : undefined, previousOwnPlatforms ? previousOwnPlatforms.ownPlatformNames : undefined, id);
			})
		};
	}

	return result;
};
