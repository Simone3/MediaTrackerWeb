import { SELECT_CATEGORY } from 'app/redux/actions/category/const';
import { COMPLETE_IMPORTING_OLD_APP_EXPORT } from 'app/redux/actions/import-export/const';
import { COMPLETE_DELETING_OWN_PLATFORM, COMPLETE_FETCHING_OWN_PLATFORMS, COMPLETE_SAVING_OWN_PLATFORM, FAIL_DELETING_OWN_PLATFORM, FAIL_FETCHING_OWN_PLATFORMS, HIGHLIGHT_OWN_PLATFORM, INVALIDATE_OWN_PLATFORMS, REMOVE_OWN_PLATFORM_HIGHLIGHT, START_DELETING_OWN_PLATFORM, START_FETCHING_OWN_PLATFORMS } from 'app/redux/actions/own-platform/const';
import { CompleteFetchingOwnPlatformsAction, HighlightOwnPlatformAction } from 'app/redux/actions/own-platform/types';
import { OwnPlatformsListState } from 'app/redux/state/own-platform';
import { Action } from 'redux';

/**
 * The initial state for the own platforms list
 */
const initialState: OwnPlatformsListState = {
	ownPlatforms: [],
	status: 'REQUIRES_FETCH',
	highlightedOwnPlatform: undefined
};

/**
 * Reducer for the own platforms list portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const ownPlatformsList = (state: OwnPlatformsListState = initialState, action: Action): OwnPlatformsListState => {
	
	switch(action.type) {

		// When the app starts fetching the list of own platforms, the status changes to show the loading indicator
		case START_FETCHING_OWN_PLATFORMS: {

			return {
				...state,
				status: 'FETCHING'
			};
		}
	
		// When the app completes the fetching process, the status is reset and the retrieved list is saved
		case COMPLETE_FETCHING_OWN_PLATFORMS: {

			const receiveOwnPlatformsAction = action as CompleteFetchingOwnPlatformsAction;
			
			return {
				...state,
				status: 'FETCHED',
				ownPlatforms: receiveOwnPlatformsAction.ownPlatforms
			};
		}

		// When the app fails to fetch the own platforms, the status is reset and an empty list is loaded (an error is shown by the global handler)
		case FAIL_FETCHING_OWN_PLATFORMS: {

			return {
				...state,
				status: 'FETCHED',
				ownPlatforms: []
			};
		}

		// When the list is explicitly invalidated or when a new own platform has been successfully saved, the list is marked for reload
		case INVALIDATE_OWN_PLATFORMS:
		case COMPLETE_SAVING_OWN_PLATFORM: {
		
			return {
				...state,
				status: 'REQUIRES_FETCH'
			};
		}

		// When the app starts deleting a own platform, the status changes to show the loading indicator
		case START_DELETING_OWN_PLATFORM: {

			return {
				...state,
				status: 'DELETING'
			};
		}

		// When the app completes the delete process, the list is marked for reload
		case COMPLETE_DELETING_OWN_PLATFORM: {
		
			return {
				...state,
				status: 'REQUIRES_FETCH'
			};
		}

		// When the app fails to delete a own platform, the status is reset (an error is shown by the global handler)
		case FAIL_DELETING_OWN_PLATFORM: {
		
			return {
				...state,
				status: 'FETCHED'
			};
		}

		// When a own platform is highlighted (e.g. to open the context menu), the corresponding state field is set
		case HIGHLIGHT_OWN_PLATFORM: {

			const highlightOwnPlatformAction = action as HighlightOwnPlatformAction;

			return {
				...state,
				highlightedOwnPlatform: highlightOwnPlatformAction.ownPlatform
			};
		}

		// When a own platform is no longer highlighted (e.g. to close the context menu), the corresponding state field is reset
		case REMOVE_OWN_PLATFORM_HIGHLIGHT: {

			return {
				...state,
				highlightedOwnPlatform: undefined
			};
		}

		// When a category is selected, the own platform data is reset
		case SELECT_CATEGORY: {

			return {
				...initialState
			};
		}

		// When a bulk import completes, the list is reset
		case COMPLETE_IMPORTING_OLD_APP_EXPORT: {

			return {
				...initialState
			};
		}

		default:
			return state;
	}
};
