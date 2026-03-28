import { COMPLETE_LOGGING_USER_OUT } from 'app/redux/actions/user/const';
import { categoryDetails, mapCategoryDetailsForPersistence } from 'app/redux/reducers/category/details';
import { categoryGlobal, mapCategoryGlobalForPersistence } from 'app/redux/reducers/category/global';
import { categoriesList, mapCategoriesListForPersistence } from 'app/redux/reducers/category/list';
import { error, mapErrorForPersistence } from 'app/redux/reducers/error';
import { groupDetails, mapGroupDetailsForPersistence } from 'app/redux/reducers/group/details';
import { groupGlobal, mapGroupGlobalForPersistence } from 'app/redux/reducers/group/global';
import { groupsList, mapGroupsListForPersistence } from 'app/redux/reducers/group/list';
import { mediaItemDetails, mapMediaItemDetailsForPersistence } from 'app/redux/reducers/media-item/details';
import { mediaItemsList, mapMediaItemsListForPersistence } from 'app/redux/reducers/media-item/list';
import { ownPlatformDetails, mapOwnPlatformDetailsForPersistence } from 'app/redux/reducers/own-platform/details';
import { ownPlatformGlobal, mapOwnPlatformGlobalForPersistence } from 'app/redux/reducers/own-platform/global';
import { ownPlatformsList, mapOwnPlatformsListForPersistence } from 'app/redux/reducers/own-platform/list';
import { tvShowSeasonDetails, mapTvShowSeasonDetailsForPersistence } from 'app/redux/reducers/tv-show-season/details';
import { tvShowSeasonsList, mapTvShowSeasonsListForPersistence } from 'app/redux/reducers/tv-show-season/list';
import { userGlobal, mapUserGlobalForPersistence } from 'app/redux/reducers/user/global';
import { userOperations, mapUserOperationsForPersistence } from 'app/redux/reducers/user/operations';
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
	groupGlobal,
	groupsList,
	groupDetails,
	ownPlatformGlobal,
	ownPlatformsList,
	ownPlatformDetails
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

/**
 * Not a reducer per se but an utility to map the state for persistence; placed here to keep all state definitions in one place
 * @param state the current state
 * @returns the mapped state
 */
export const mapStateForPersistence = (state: State): State => {
	return {
		error: mapErrorForPersistence(),
		userGlobal: mapUserGlobalForPersistence(),
		userOperations: mapUserOperationsForPersistence(),
		categoryGlobal: mapCategoryGlobalForPersistence(state.categoryGlobal),
		categoriesList: mapCategoriesListForPersistence(state.categoriesList),
		categoryDetails: mapCategoryDetailsForPersistence(state.categoryDetails),
		mediaItemsList: mapMediaItemsListForPersistence(state.mediaItemsList),
		mediaItemDetails: mapMediaItemDetailsForPersistence(state.mediaItemDetails),
		tvShowSeasonsList: mapTvShowSeasonsListForPersistence(state.tvShowSeasonsList),
		tvShowSeasonDetails: mapTvShowSeasonDetailsForPersistence(state.tvShowSeasonDetails),
		groupGlobal: mapGroupGlobalForPersistence(state.groupGlobal),
		groupsList: mapGroupsListForPersistence(state.groupsList),
		groupDetails: mapGroupDetailsForPersistence(state.groupDetails),
		ownPlatformGlobal: mapOwnPlatformGlobalForPersistence(state.ownPlatformGlobal),
		ownPlatformsList: mapOwnPlatformsListForPersistence(state.ownPlatformsList),
		ownPlatformDetails: mapOwnPlatformDetailsForPersistence(state.ownPlatformDetails)
	};
};
