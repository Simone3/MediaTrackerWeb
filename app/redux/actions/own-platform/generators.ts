import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { ASK_CONFIRMATION_BEFORE_SAVING_OWN_PLATFORM, COMPLETE_DELETING_OWN_PLATFORM, COMPLETE_FETCHING_OWN_PLATFORMS, COMPLETE_SAVING_OWN_PLATFORM, DELETE_OWN_PLATFORM, FAIL_DELETING_OWN_PLATFORM, FAIL_FETCHING_OWN_PLATFORMS, FAIL_SAVING_OWN_PLATFORM, FETCH_OWN_PLATFORMS, HIGHLIGHT_OWN_PLATFORM, INVALIDATE_OWN_PLATFORMS, LOAD_NEW_OWN_PLATFORM_DETAILS, LOAD_OWN_PLATFORM_DETAILS, REMOVE_OWN_PLATFORM_HIGHLIGHT, REQUEST_OWN_PLATFORM_SAVE, REQUEST_OWN_PLATFORM_SELECTION, SAVE_OWN_PLATFORM, SELECT_OWN_PLATFORM, SET_OWN_PLATFORM_FORM_STATUS, START_DELETING_OWN_PLATFORM, START_FETCHING_OWN_PLATFORMS, START_SAVING_OWN_PLATFORM } from './const';
import { AskConfirmationBeforeSavingOwnPlatformAction, CompleteDeletingOwnPlatformAction, CompleteFetchingOwnPlatformsAction, CompleteSavingOwnPlatformAction, DeleteOwnPlatformAction, FailDeletingOwnPlatformAction, FailFetchingOwnPlatformsAction, FailSavingOwnPlatformAction, FetchOwnPlatformsAction, HighlightOwnPlatformAction, InvalidateOwnPlatformsAction, LoadNewOwnPlatformDetailsAction, LoadOwnPlatformDetailsAction, RemoveOwnPlatformHighlightAction, RequestOwnPlatformSaveAction, RequestOwnPlatformSelectionAction, SaveOwnPlatformAction, SelectOwnPlatformAction, SetOwnPlatformFormStatusAction, StartDeletingOwnPlatformAction, StartFetchingOwnPlatformsAction, StartSavingOwnPlatformAction } from './types';

/**
 * Generator for the fetch own platforms list action, which causes the request own platforms action, the async own platforms fetch and then the receive own platforms action
 * @returns the action
 */
export const fetchOwnPlatforms = (): FetchOwnPlatformsAction => {
	
	return {
		type: FETCH_OWN_PLATFORMS
	};
};

/**
 * Generator for the start fetching own platforms action, which marks the start of the own platforms list fetching operation
 * @returns the action
 */
export const startFetchingOwnPlatforms = (): StartFetchingOwnPlatformsAction => {
	
	return {
		type: START_FETCHING_OWN_PLATFORMS
	};
};

/**
 * Generator for the complete fetching own platforms action, which marks the successful end of the own platforms list fetching operation
 * @param ownPlatforms the fetched own platforms, possibly an empty array
 * @returns the action
 */
export const completeFetchingOwnPlatforms = (ownPlatforms: OwnPlatformInternal[]): CompleteFetchingOwnPlatformsAction => {
	
	return {
		type: COMPLETE_FETCHING_OWN_PLATFORMS,
		ownPlatforms: ownPlatforms
	};
};

/**
 * Generator for the fail fetching own platforms action, which marks the unsuccessful end of the own platforms list fetching operation
 * @returns the action
 */
export const failFetchingOwnPlatforms = (): FailFetchingOwnPlatformsAction => {
	
	return {
		type: FAIL_FETCHING_OWN_PLATFORMS
	};
};

/**
 * Generator for the invalidate own platforms action, which marks the own platforms list as invalid, i.e. they require a reload
 * @returns the action
 */
export const invalidateOwnPlatforms = (): InvalidateOwnPlatformsAction => {

	return {
		type: INVALIDATE_OWN_PLATFORMS
	};
};

/**
 * Generator for the load new own platform action, which resets the own platform details state to the initial values
 * @returns the action
 */
export const loadNewOwnPlatformDetails = (): LoadNewOwnPlatformDetailsAction => {
	
	return {
		type: LOAD_NEW_OWN_PLATFORM_DETAILS
	};
};

/**
 * Generator for the load existing own platform action, which sets the own platform details state
 * @param ownPlatform the own platform data
 * @returns the action
 */
export const loadOwnPlatformDetails = (ownPlatform: OwnPlatformInternal): LoadOwnPlatformDetailsAction => {
	
	return {
		type: LOAD_OWN_PLATFORM_DETAILS,
		ownPlatform: ownPlatform
	};
};

/**
 * Generator for the set own platform form status, which sets the current status of the own platform details form
 * @param valid true if the form is currently valid (no validation errors)
 * @param dirty true if the form is currently dirty (one or more fields changed)
 * @returns the action
 */
export const setOwnPlatformFormStatus = (valid: boolean, dirty: boolean): SetOwnPlatformFormStatusAction => {
	
	return {
		type: SET_OWN_PLATFORM_FORM_STATUS,
		valid: valid,
		dirty: dirty
	};
};

/**
 * Generator for the request own platform save action, which requests the own platform form validation and, if OK, submission
 * @returns the action
 */
export const requestOwnPlatformSave = (): RequestOwnPlatformSaveAction => {
	
	return {
		type: REQUEST_OWN_PLATFORM_SAVE
	};
};

/**
 * Generator for the save own platform action, which causes the start saving own platform action, the async own platform store and then the complete saving own platform action
 * @param ownPlatform the own platform data
 * @param confirmSameName if the user confirmed to save the own platform even if it has the same name as an existing item
 * @returns the action
 */
export const saveOwnPlatform = (ownPlatform: OwnPlatformInternal, confirmSameName: boolean): SaveOwnPlatformAction => {
	
	return {
		type: SAVE_OWN_PLATFORM,
		ownPlatform: ownPlatform,
		confirmSameName: confirmSameName
	};
};

/**
 * Generator for the start saving own platform action, which marks the start of the own platform saving operation
 * @param ownPlatform the own platform data
 * @returns the action
 */
export const startSavingOwnPlatform = (ownPlatform: OwnPlatformInternal): StartSavingOwnPlatformAction => {
	
	return {
		type: START_SAVING_OWN_PLATFORM,
		ownPlatform: ownPlatform
	};
};

/**
 * Generator for the ask confirmation before saving own platform action, which triggers a user pop-up to confirm a own platform save process (e.g. same-name check on insert)
 * @returns the action
 */
export const askConfirmationBeforeSavingOwnPlatform = (): AskConfirmationBeforeSavingOwnPlatformAction => {
	
	return {
		type: ASK_CONFIRMATION_BEFORE_SAVING_OWN_PLATFORM
	};
};

/**
 * Generator for the complete saving own platform action, which marks the successful end of the own platform saving operation
 * @param ownPlatform the saved own platform
 * @returns the action
 */
export const completeSavingOwnPlatform = (ownPlatform: OwnPlatformInternal): CompleteSavingOwnPlatformAction => {
	
	return {
		type: COMPLETE_SAVING_OWN_PLATFORM,
		ownPlatform: ownPlatform
	};
};

/**
 * Generator for the complete saving own platform action, which marks the unsuccessful end of the own platform saving operation
 * @returns the action
 */
export const failSavingOwnPlatform = (): FailSavingOwnPlatformAction => {
	
	return {
		type: FAIL_SAVING_OWN_PLATFORM
	};
};

/**
 * Generator for the delete own platform action, which causes the start deleting own platform action, the async own platform removal and then the complete deleting own platform action
 * @param ownPlatform the own platform data
 * @returns the action
 */
export const deleteOwnPlatform = (ownPlatform: OwnPlatformInternal): DeleteOwnPlatformAction => {
	
	return {
		type: DELETE_OWN_PLATFORM,
		ownPlatform: ownPlatform
	};
};

/**
 * Generator for the start deleting own platform action, which marks the start of the own platform deleting operation
 * @returns the action
 */
export const startDeletingOwnPlatform = (): StartDeletingOwnPlatformAction => {
	
	return {
		type: START_DELETING_OWN_PLATFORM
	};
};

/**
 * Generator for the complete deleting own platform action, which marks the successful end of the own platform deleting operation
 * @param ownPlatformId the deleted own platform ID
 * @returns the action
 */
export const completeDeletingOwnPlatform = (ownPlatformId: string): CompleteDeletingOwnPlatformAction => {
	
	return {
		type: COMPLETE_DELETING_OWN_PLATFORM,
		ownPlatformId: ownPlatformId
	};
};

/**
 * Generator for the fail deleting own platform action, which marks the unsuccessful end of the own platform deleting operation
 * @returns the action
 */
export const failDeletingOwnPlatform = (): FailDeletingOwnPlatformAction => {
	
	return {
		type: FAIL_DELETING_OWN_PLATFORM
	};
};

/**
 * Generator for the highlight own platform action, which marks a own platform as highlighted
 * @param ownPlatform the own platform
 * @returns the action
 */
export const highlightOwnPlatform = (ownPlatform: OwnPlatformInternal): HighlightOwnPlatformAction => {
	
	return {
		type: HIGHLIGHT_OWN_PLATFORM,
		ownPlatform: ownPlatform
	};
};

/**
 * Generator for the remove own platform highlight action, which removes any highlighted own platform
 * @returns the action
 */
export const removeOwnPlatformHighlight = (): RemoveOwnPlatformHighlightAction => {
	
	return {
		type: REMOVE_OWN_PLATFORM_HIGHLIGHT
	};
};

/**
 * Generator for the request own platform selection action, which opens the own platform list
 * @returns the action
 */
export const requestOwnPlatformSelection = (): RequestOwnPlatformSelectionAction => {
	
	return {
		type: REQUEST_OWN_PLATFORM_SELECTION
	};
};

/**
 * Generator for the select own platform action, which sets the own platform into the global state to allow retrieval of the correct media items, etc.
 * @param ownPlatform the selected own platform or undefined if none
 * @returns the action
 */
export const selectOwnPlatform = (ownPlatform: OwnPlatformInternal | undefined): SelectOwnPlatformAction => {
	
	return {
		type: SELECT_OWN_PLATFORM,
		ownPlatform: ownPlatform
	};
};
