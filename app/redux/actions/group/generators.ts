import { GroupInternal } from 'app/data/models/internal/group';
import { ASK_CONFIRMATION_BEFORE_SAVING_GROUP, COMPLETE_DELETING_GROUP, COMPLETE_FETCHING_GROUPS, COMPLETE_SAVING_GROUP, DELETE_GROUP, FAIL_DELETING_GROUP, FAIL_FETCHING_GROUPS, FAIL_SAVING_GROUP, FETCH_GROUPS, HIGHLIGHT_GROUP, INVALIDATE_GROUPS, LOAD_GROUP_DETAILS, LOAD_NEW_GROUP_DETAILS, REMOVE_GROUP_HIGHLIGHT, REQUEST_GROUP_SAVE, REQUEST_GROUP_SELECTION, SAVE_GROUP, SELECT_GROUP, SET_GROUP_FORM_STATUS, START_DELETING_GROUP, START_FETCHING_GROUPS, START_SAVING_GROUP } from './const';
import { AskConfirmationBeforeSavingGroupAction, CompleteDeletingGroupAction, CompleteFetchingGroupsAction, CompleteSavingGroupAction, DeleteGroupAction, FailDeletingGroupAction, FailFetchingGroupsAction, FailSavingGroupAction, FetchGroupsAction, HighlightGroupAction, InvalidateGroupsAction, LoadGroupDetailsAction, LoadNewGroupDetailsAction, RemoveGroupHighlightAction, RequestGroupSaveAction, RequestGroupSelectionAction, SaveGroupAction, SelectGroupAction, SetGroupFormStatusAction, StartDeletingGroupAction, StartFetchingGroupsAction, StartSavingGroupAction } from './types';

/**
 * Generator for the fetch groups list action, which causes the request groups action, the async groups fetch and then the receive groups action
 * @returns the action
 */
export const fetchGroups = (): FetchGroupsAction => {
	
	return {
		type: FETCH_GROUPS
	};
};

/**
 * Generator for the start fetching groups action, which marks the start of the groups list fetching operation
 * @returns the action
 */
export const startFetchingGroups = (): StartFetchingGroupsAction => {
	
	return {
		type: START_FETCHING_GROUPS
	};
};

/**
 * Generator for the complete fetching groups action, which marks the successful end of the groups list fetching operation
 * @param groups the fetched groups, possibly an empty array
 * @returns the action
 */
export const completeFetchingGroups = (groups: GroupInternal[]): CompleteFetchingGroupsAction => {
	
	return {
		type: COMPLETE_FETCHING_GROUPS,
		groups: groups
	};
};

/**
 * Generator for the fail fetching groups action, which marks the unsuccessful end of the groups list fetching operation
 * @returns the action
 */
export const failFetchingGroups = (): FailFetchingGroupsAction => {
	
	return {
		type: FAIL_FETCHING_GROUPS
	};
};

/**
 * Generator for the invalidate groups action, which marks the groups list as invalid, i.e. they require a reload
 * @returns the action
 */
export const invalidateGroups = (): InvalidateGroupsAction => {

	return {
		type: INVALIDATE_GROUPS
	};
};

/**
 * Generator for the load new group action, which resets the group details state to the initial values
 * @returns the action
 */
export const loadNewGroupDetails = (): LoadNewGroupDetailsAction => {
	
	return {
		type: LOAD_NEW_GROUP_DETAILS
	};
};

/**
 * Generator for the load existing group action, which sets the group details state
 * @param group the group data
 * @returns the action
 */
export const loadGroupDetails = (group: GroupInternal): LoadGroupDetailsAction => {
	
	return {
		type: LOAD_GROUP_DETAILS,
		group: group
	};
};

/**
 * Generator for the set group form status, which sets the current status of the group details form
 * @param valid true if the form is currently valid (no validation errors)
 * @param dirty true if the form is currently dirty (one or more fields changed)
 * @returns the action
 */
export const setGroupFormStatus = (valid: boolean, dirty: boolean): SetGroupFormStatusAction => {
	
	return {
		type: SET_GROUP_FORM_STATUS,
		valid: valid,
		dirty: dirty
	};
};

/**
 * Generator for the request group save action, which requests the group form validation and, if OK, submission
 * @returns the action
 */
export const requestGroupSave = (): RequestGroupSaveAction => {
	
	return {
		type: REQUEST_GROUP_SAVE
	};
};

/**
 * Generator for the save group action, which causes the start saving group action, the async group store and then the complete saving group action
 * @param group the group data
 * @param confirmSameName if the user confirmed to save the group even if it has the same name as an existing item
 * @returns the action
 */
export const saveGroup = (group: GroupInternal, confirmSameName: boolean): SaveGroupAction => {
	
	return {
		type: SAVE_GROUP,
		group: group,
		confirmSameName: confirmSameName
	};
};

/**
 * Generator for the start saving group action, which marks the start of the group saving operation
 * @param group the group data
 * @returns the action
 */
export const startSavingGroup = (group: GroupInternal): StartSavingGroupAction => {
	
	return {
		type: START_SAVING_GROUP,
		group: group
	};
};

/**
 * Generator for the ask confirmation before saving group action, which triggers a user pop-up to confirm a group save process (e.g. same-name check on insert)
 * @returns the action
 */
export const askConfirmationBeforeSavingGroup = (): AskConfirmationBeforeSavingGroupAction => {
	
	return {
		type: ASK_CONFIRMATION_BEFORE_SAVING_GROUP
	};
};

/**
 * Generator for the complete saving group action, which marks the successful end of the group saving operation
 * @param group the saved group
 * @returns the action
 */
export const completeSavingGroup = (group: GroupInternal): CompleteSavingGroupAction => {
	
	return {
		type: COMPLETE_SAVING_GROUP,
		group: group
	};
};

/**
 * Generator for the complete saving group action, which marks the unsuccessful end of the group saving operation
 * @returns the action
 */
export const failSavingGroup = (): FailSavingGroupAction => {
	
	return {
		type: FAIL_SAVING_GROUP
	};
};

/**
 * Generator for the delete group action, which causes the start deleting group action, the async group removal and then the complete deleting group action
 * @param group the group data
 * @returns the action
 */
export const deleteGroup = (group: GroupInternal): DeleteGroupAction => {
	
	return {
		type: DELETE_GROUP,
		group: group
	};
};

/**
 * Generator for the start deleting group action, which marks the start of the group deleting operation
 * @returns the action
 */
export const startDeletingGroup = (): StartDeletingGroupAction => {
	
	return {
		type: START_DELETING_GROUP
	};
};

/**
 * Generator for the complete deleting group action, which marks the successful end of the group deleting operation
 * @param groupId the deleted group ID
 * @returns the action
 */
export const completeDeletingGroup = (groupId: string): CompleteDeletingGroupAction => {
	
	return {
		type: COMPLETE_DELETING_GROUP,
		groupId: groupId
	};
};

/**
 * Generator for the fail deleting group action, which marks the unsuccessful end of the group deleting operation
 * @returns the action
 */
export const failDeletingGroup = (): FailDeletingGroupAction => {
	
	return {
		type: FAIL_DELETING_GROUP
	};
};

/**
 * Generator for the highlight group action, which marks a group as highlighted
 * @param group the group
 * @returns the action
 */
export const highlightGroup = (group: GroupInternal): HighlightGroupAction => {
	
	return {
		type: HIGHLIGHT_GROUP,
		group: group
	};
};

/**
 * Generator for the remove group highlight action, which removes any highlighted group
 * @returns the action
 */
export const removeGroupHighlight = (): RemoveGroupHighlightAction => {
	
	return {
		type: REMOVE_GROUP_HIGHLIGHT
	};
};

/**
 * Generator for the request group selection action, which opens the groups list
 * @returns the action
 */
export const requestGroupSelection = (): RequestGroupSelectionAction => {
	
	return {
		type: REQUEST_GROUP_SELECTION
	};
};

/**
 * Generator for the select group action, which sets the group into the global state to allow retrieval of the correct media items, etc.
 * @param group the selected group or undefined if none
 * @returns the action
 */
export const selectGroup = (group: GroupInternal | undefined): SelectGroupAction => {
	
	return {
		type: SELECT_GROUP,
		group: group
	};
};
