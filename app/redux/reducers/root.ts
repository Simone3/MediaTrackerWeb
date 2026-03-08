import { COMPLETE_LOGGING_USER_OUT } from 'app/redux/actions/user/const';
import { categoryDetails } from 'app/redux/reducers/category/details';
import { categoryGlobal } from 'app/redux/reducers/category/global';
import { categoriesList } from 'app/redux/reducers/category/list';
import { error } from 'app/redux/reducers/error';
import { groupDetails } from 'app/redux/reducers/group/details';
import { groupGlobal } from 'app/redux/reducers/group/global';
import { groupsList } from 'app/redux/reducers/group/list';
import { importExport } from 'app/redux/reducers/import-export/import-export';
import { mediaItemDetails } from 'app/redux/reducers/media-item/details';
import { mediaItemsList } from 'app/redux/reducers/media-item/list';
import { ownPlatformDetails } from 'app/redux/reducers/own-platform/details';
import { ownPlatformGlobal } from 'app/redux/reducers/own-platform/global';
import { ownPlatformsList } from 'app/redux/reducers/own-platform/list';
import { tvShowSeasonDetails } from 'app/redux/reducers/tv-show-season/details';
import { tvShowSeasonsList } from 'app/redux/reducers/tv-show-season/list';
import { userGlobal } from 'app/redux/reducers/user/global';
import { userOperations } from 'app/redux/reducers/user/operations';
import { State } from 'app/redux/state/state';
import { Action, combineReducers } from 'redux';

/**
 * Combination of all app reducers
 */
export const allReduces = combineReducers({
	error,
	userGlobal,
	userOperations,
	categoryGlobal,
	categoriesList,
	categoryDetails,
	mediaItemsList,
	mediaItemDetails,
	tvShowSeasonsList,
	tvShowSeasonDetails,
	ownPlatformGlobal,
	groupGlobal,
	groupsList,
	groupDetails,
	ownPlatformsList,
	ownPlatformDetails,
	importExport
});

/**
 * The application root reducer
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const rootReducer = (state: State | undefined, action: Action): State => {

	// When the user logs out, the whole state is reset (child reducers all set their initial state)
	if(action.type === COMPLETE_LOGGING_USER_OUT) {

		state = undefined;
	}

	return allReduces(state, action);
};
