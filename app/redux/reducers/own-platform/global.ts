import { LOAD_MEDIA_ITEM_DETAILS, LOAD_NEW_MEDIA_ITEM_DETAILS } from 'app/redux/actions/media-item/const';
import { LoadMediaItemDetailsAction } from 'app/redux/actions/media-item/types';
import { SELECT_OWN_PLATFORM } from 'app/redux/actions/own-platform/const';
import { SelectOwnPlatformAction } from 'app/redux/actions/own-platform/types';
import { OwnPlatformGlobalState } from 'app/redux/state/own-platform';
import { Action } from 'redux';

/**
 * The initial state for the global own platform data
 */
const initialState: OwnPlatformGlobalState = {
	selectedOwnPlatform: undefined
};

/**
 * Reducer for the global own platform portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const ownPlatformGlobal = (state: OwnPlatformGlobalState = initialState, action: Action): OwnPlatformGlobalState => {
	
	switch(action.type) {

		// When a own platform is selected, it is marked as such
		case SELECT_OWN_PLATFORM: {

			const selectOwnPlatformAction = action as SelectOwnPlatformAction;

			const ownPlatform = selectOwnPlatformAction.ownPlatform;

			return {
				...initialState,
				selectedOwnPlatform: ownPlatform
			};
		}

		// When the media item details page is initialized with a new media item, the currently selected own platform is reset
		case LOAD_NEW_MEDIA_ITEM_DETAILS: {

			return {
				...state,
				selectedOwnPlatform: undefined
			};
		}
	
		// When the media item details page is initialized with an existing media item, the currently selected own platform is reset
		case LOAD_MEDIA_ITEM_DETAILS: {

			const loadMediaItemAction = action as LoadMediaItemDetailsAction;
			
			return {
				...state,
				selectedOwnPlatform: loadMediaItemAction.mediaItem.ownPlatform
			};
		}

		default:
			return state;
	}
};
