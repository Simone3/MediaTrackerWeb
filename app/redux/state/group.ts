import { GroupInternal } from 'app/data/models/internal/group';

/**
 * Portion of the internal state with the global group data
 */
export type GroupGlobalState = {

	/**
	 * The current group, e.g. to show the currently selected group for a media item
	 * Undefined means no group has been selected yet
	 */
	selectedGroup: GroupInternal | undefined;
}

/**
 * Portion of the internal state with the groups list information
 */
export type GroupsListState = {

	/**
	 * The list of available groups
	 */
	readonly groups: GroupInternal[];

	/**
	 * The current status of the groups list
	 */
	readonly status: GroupsListStatus;

	/**
	 * The currently highlighted (e.g. context menu is open) group, or undefined if none is highlighted
	 */
	readonly highlightedGroup: GroupInternal | undefined;
}

/**
 * Portion of the internal state with the group details information
 */
export type GroupDetailsState = {

	/**
	 * The group data
	 */
	readonly group?: GroupInternal;

	/**
	 * If the currently loaded group is valid (no validation error occurred)
	 */
	readonly valid: boolean;

	/**
	 * If the currently loaded group is dirty (one or more fields are different from initial values)
	 */
	readonly dirty: boolean;

	/**
	 * The current status of the group saving process
	 */
	readonly saveStatus: GroupSaveStatus;
}

/**
 * The current status of the groups list
 */
export type GroupsListStatus = 'REQUIRES_FETCH' | 'FETCHING' | 'FETCHED' | 'DELETING';

/**
 * The current status of the group saving process
 */
export type GroupSaveStatus = 'IDLE' | 'REQUESTED' | 'REQUIRES_CONFIRMATION' | 'SAVING' | 'SAVED';
