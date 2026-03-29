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
 * The initial value for the global group state
 */
export const groupGlobalStateInitialValue: GroupGlobalState = {
	selectedGroup: undefined
};

/**
 * Utility to map the state for persistence
 * @param state the current state
 * @returns the mapped state
 */
export const mapGroupGlobalForPersistence = (state: GroupGlobalState): GroupGlobalState => {
	return {
		...state
	};
};

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
 * The initial value for the groups list state
 */
export const groupsListStateInitialValue: GroupsListState = {
	groups: [],
	status: 'REQUIRES_FETCH',
	highlightedGroup: undefined
};

/**
 * Utility to map the state for persistence
 * @param state the current state
 * @returns the mapped state
 */
export const mapGroupsListForPersistence = (state: GroupsListState): GroupsListState => {
	return {
		...state,
		status: 'REQUIRES_FETCH',
		highlightedGroup: undefined
	};
};

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
 * The initial value for the group details state
 */
export const groupDetailsStateInitialValue: GroupDetailsState = {
	group: undefined,
	valid: false,
	dirty: false,
	saveStatus: 'IDLE'
};

/**
 * Utility to map the state for persistence
 * @param state the current state
 * @returns the mapped state
 */
export const mapGroupDetailsForPersistence = (state: GroupDetailsState): GroupDetailsState => {
	return {
		...state,
		saveStatus: 'IDLE'
	};
};

/**
 * The current status of the groups list
 */
export type GroupsListStatus = 'REQUIRES_FETCH' | 'FETCHING' | 'FETCHED' | 'FETCH_FAILED' | 'DELETING';

/**
 * The current status of the group saving process
 */
export type GroupSaveStatus = 'IDLE' | 'REQUESTED' | 'REQUIRES_CONFIRMATION' | 'SAVING' | 'SAVED';
