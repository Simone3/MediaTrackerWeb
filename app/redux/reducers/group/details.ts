import { DEFAULT_GROUP } from 'app/data/models/internal/group';
import { ASK_CONFIRMATION_BEFORE_SAVING_GROUP, COMPLETE_SAVING_GROUP, FAIL_SAVING_GROUP, LOAD_GROUP_DETAILS, LOAD_NEW_GROUP_DETAILS, REQUEST_GROUP_SAVE, SET_GROUP_FORM_STATUS, START_SAVING_GROUP } from 'app/redux/actions/group/const';
import { LoadGroupDetailsAction, SetGroupFormStatusAction, StartSavingGroupAction } from 'app/redux/actions/group/types';
import { GroupDetailsState } from 'app/redux/state/group';
import { Action } from 'redux';

/**
 * The initial state for the group details
 */
const initialState: GroupDetailsState = {
	group: undefined,
	valid: false,
	dirty: false,
	saveStatus: 'IDLE'
};

/**
 * Reducer for the group details portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const groupDetails = (state: GroupDetailsState = initialState, action: Action): GroupDetailsState => {
	
	switch(action.type) {

		// When the details page is started with a new group, the status is reset and the default group is loaded
		case LOAD_NEW_GROUP_DETAILS: {

			return {
				...state,
				saveStatus: 'IDLE',
				group: DEFAULT_GROUP
			};
		}
	
		// When the details page is started with an existing group, the status is reset and the given group is loaded
		case LOAD_GROUP_DETAILS: {

			const loadGroupAction = action as LoadGroupDetailsAction;
			
			return {
				...state,
				saveStatus: 'IDLE',
				group: loadGroupAction.group
			};
		}
	
		// When the form status changes, the corresponding state fields are set
		case SET_GROUP_FORM_STATUS: {

			const setGroupFormStatusAction = action as SetGroupFormStatusAction;
			
			return {
				...state,
				valid: setGroupFormStatusAction.valid,
				dirty: setGroupFormStatusAction.dirty
			};
		}

		// When the group save is requested, the status changes (e.g. allows header save button to notify the form about the request)
		case REQUEST_GROUP_SAVE: {

			return {
				...state,
				saveStatus: 'REQUESTED'
			};
		}
	
		// When the app starts saving a group, the status changes to show the loading indicator
		case START_SAVING_GROUP: {

			const startSavingGroupAction = action as StartSavingGroupAction;

			return {
				...state,
				group: startSavingGroupAction.group,
				saveStatus: 'SAVING'
			};
		}
	
		// When the app requires a confirmation before saving a group, the status changes to show the alert
		case ASK_CONFIRMATION_BEFORE_SAVING_GROUP: {

			return {
				...state,
				saveStatus: 'REQUIRES_CONFIRMATION'
			};
		}
	
		// When the app completes the save process, the status changes (at this point a navigation back to the list is expected)
		case COMPLETE_SAVING_GROUP: {

			return {
				...state,
				saveStatus: 'SAVED'
			};
		}
	
		// When the app fails to save a group, the status is reset (an error is shown by the global handler)
		case FAIL_SAVING_GROUP: {

			return {
				...state,
				saveStatus: 'IDLE'
			};
		}

		default:
			return state;
	}
};
