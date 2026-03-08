import { SELECT_GROUP } from 'app/redux/actions/group/const';
import { SelectGroupAction } from 'app/redux/actions/group/types';
import { LOAD_MEDIA_ITEM_DETAILS, LOAD_NEW_MEDIA_ITEM_DETAILS } from 'app/redux/actions/media-item/const';
import { LoadMediaItemDetailsAction } from 'app/redux/actions/media-item/types';
import { GroupGlobalState } from 'app/redux/state/group';
import { Action } from 'redux';

/**
 * The initial state for the global group data
 */
const initialState: GroupGlobalState = {
	selectedGroup: undefined
};

/**
 * Reducer for the global group portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const groupGlobal = (state: GroupGlobalState = initialState, action: Action): GroupGlobalState => {
	
	switch(action.type) {

		// When a group is selected, it is marked as such
		case SELECT_GROUP: {

			const selectGroupAction = action as SelectGroupAction;

			const group = selectGroupAction.group;

			return {
				...initialState,
				selectedGroup: group
			};
		}

		// When the media item details page is initialized with a new media item, the currently selected group is reset
		case LOAD_NEW_MEDIA_ITEM_DETAILS: {

			return {
				...state,
				selectedGroup: undefined
			};
		}
	
		// When the media item details page is initialized with an existing media item, the currently selected group is reset
		case LOAD_MEDIA_ITEM_DETAILS: {

			const loadMediaItemAction = action as LoadMediaItemDetailsAction;
			
			return {
				...state,
				selectedGroup: loadMediaItemAction.mediaItem.group
			};
		}

		default:
			return state;
	}
};
