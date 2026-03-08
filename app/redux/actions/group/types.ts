import { GroupInternal } from 'app/data/models/internal/group';
import { Action } from 'redux';

/**
 * The fetch groups action
 */
export type FetchGroupsAction = Action & {
	
};

/**
 * The start fetching groups action
 */
export type StartFetchingGroupsAction = Action & {
	
};

/**
 * The complete fetching groups action
 */
export type CompleteFetchingGroupsAction = Action & {
	
	groups: GroupInternal[];
};

/**
 * The fail fetching groups action
 */
export type FailFetchingGroupsAction = Action & {
	
};

/**
 * The invalidate groups action
 */
export type InvalidateGroupsAction = Action & {
	
};

/**
 * The load new group action
 */
export type LoadNewGroupDetailsAction = Action & {
	
};

/**
 * The load existing group action
 */
export type LoadGroupDetailsAction = Action & {
	
	group: GroupInternal;
};

/**
 * The set group form status action
 */
export type SetGroupFormStatusAction = Action & {
	
	valid: boolean;
	dirty: boolean;
};

/**
 * The request group save action
 */
export type RequestGroupSaveAction = Action & {
	
};

/**
 * The save group action
 */
export type SaveGroupAction = Action & {
	
	group: GroupInternal;
	confirmSameName: boolean;
};

/**
 * The start saving group action
 */
export type StartSavingGroupAction = Action & {
	
	group: GroupInternal;
};

/**
 * The ask confirmation before saving group action
 */
export type AskConfirmationBeforeSavingGroupAction = Action & {
	
};

/**
 * The complete saving group action
 */
export type CompleteSavingGroupAction = Action & {
	
	group: GroupInternal;
};

/**
 * The fail saving group action
 */
export type FailSavingGroupAction = Action & {
	
};

/**
 * The delete group action
 */
export type DeleteGroupAction = Action & {
	
	group: GroupInternal;
};

/**
 * The start deleting group action
 */
export type StartDeletingGroupAction = Action & {
	
};

/**
 * The complete deleting group action
 */
export type CompleteDeletingGroupAction = Action & {
	
	groupId: string;
};

/**
 * The fail deleting group action
 */
export type FailDeletingGroupAction = Action & {
	
};

/**
 * The highlight group action
 */
export type HighlightGroupAction = Action & {
	
	group: GroupInternal;
};

/**
 * The remove group highlight action
 */
export type RemoveGroupHighlightAction = Action & {
	
};

/**
 * The request group selection action
 */
export type RequestGroupSelectionAction = Action & {
	
};

/**
 * The select group action
 */
export type SelectGroupAction = Action & {
	
	group?: GroupInternal;
};
