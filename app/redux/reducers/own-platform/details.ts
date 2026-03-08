import { DEFAULT_OWN_PLATFORM } from 'app/data/models/internal/own-platform';
import { ASK_CONFIRMATION_BEFORE_SAVING_OWN_PLATFORM, COMPLETE_SAVING_OWN_PLATFORM, FAIL_SAVING_OWN_PLATFORM, LOAD_NEW_OWN_PLATFORM_DETAILS, LOAD_OWN_PLATFORM_DETAILS, REQUEST_OWN_PLATFORM_SAVE, SET_OWN_PLATFORM_FORM_STATUS, START_SAVING_OWN_PLATFORM } from 'app/redux/actions/own-platform/const';
import { LoadOwnPlatformDetailsAction, SetOwnPlatformFormStatusAction, StartSavingOwnPlatformAction } from 'app/redux/actions/own-platform/types';
import { OwnPlatformDetailsState } from 'app/redux/state/own-platform';
import { Action } from 'redux';

/**
 * The initial state for the own platform details
 */
const initialState: OwnPlatformDetailsState = {
	ownPlatform: undefined,
	valid: false,
	dirty: false,
	saveStatus: 'IDLE'
};

/**
 * Reducer for the own platform details portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const ownPlatformDetails = (state: OwnPlatformDetailsState = initialState, action: Action): OwnPlatformDetailsState => {
	
	switch(action.type) {

		// When the details page is started with a new own platform, the status is reset and the default own platform is loaded
		case LOAD_NEW_OWN_PLATFORM_DETAILS: {

			return {
				...state,
				saveStatus: 'IDLE',
				ownPlatform: DEFAULT_OWN_PLATFORM
			};
		}
	
		// When the details page is started with an existing own platform, the status is reset and the given own platform is loaded
		case LOAD_OWN_PLATFORM_DETAILS: {

			const loadOwnPlatformAction = action as LoadOwnPlatformDetailsAction;
			
			return {
				...state,
				saveStatus: 'IDLE',
				ownPlatform: loadOwnPlatformAction.ownPlatform
			};
		}
	
		// When the form status changes, the corresponding state fields are set
		case SET_OWN_PLATFORM_FORM_STATUS: {

			const setOwnPlatformFormStatusAction = action as SetOwnPlatformFormStatusAction;
			
			return {
				...state,
				valid: setOwnPlatformFormStatusAction.valid,
				dirty: setOwnPlatformFormStatusAction.dirty
			};
		}

		// When the own platform save is requested, the status changes (e.g. allows header save button to notify the form about the request)
		case REQUEST_OWN_PLATFORM_SAVE: {

			return {
				...state,
				saveStatus: 'REQUESTED'
			};
		}
	
		// When the app starts saving a own platform, the status changes to show the loading indicator
		case START_SAVING_OWN_PLATFORM: {

			const startSavingOwnPlatformAction = action as StartSavingOwnPlatformAction;

			return {
				...state,
				ownPlatform: startSavingOwnPlatformAction.ownPlatform,
				saveStatus: 'SAVING'
			};
		}
	
		// When the app requires a confirmation before saving an own platform, the status changes to show the alert
		case ASK_CONFIRMATION_BEFORE_SAVING_OWN_PLATFORM: {

			return {
				...state,
				saveStatus: 'REQUIRES_CONFIRMATION'
			};
		}
	
		// When the app completes the save process, the status changes (at this point a navigation back to the list is expected)
		case COMPLETE_SAVING_OWN_PLATFORM: {

			return {
				...state,
				saveStatus: 'SAVED'
			};
		}
	
		// When the app fails to save a own platform, the status is reset (an error is shown by the global handler)
		case FAIL_SAVING_OWN_PLATFORM: {

			return {
				...state,
				saveStatus: 'IDLE'
			};
		}

		default:
			return state;
	}
};
