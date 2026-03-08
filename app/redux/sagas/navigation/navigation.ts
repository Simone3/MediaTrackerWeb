import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { COMPLETE_SAVING_CATEGORY, LOAD_CATEGORY_DETAILS, LOAD_NEW_CATEGORY_DETAILS, SELECT_CATEGORY } from 'app/redux/actions/category/const';
import { setError } from 'app/redux/actions/error/generators';
import { COMPLETE_SAVING_GROUP, LOAD_GROUP_DETAILS, LOAD_NEW_GROUP_DETAILS, REQUEST_GROUP_SELECTION, SELECT_GROUP } from 'app/redux/actions/group/const';
import { COMPLETE_SAVING_MEDIA_ITEM, LOAD_MEDIA_ITEM_DETAILS, LOAD_NEW_MEDIA_ITEM_DETAILS } from 'app/redux/actions/media-item/const';
import { COMPLETE_SAVING_OWN_PLATFORM, LOAD_NEW_OWN_PLATFORM_DETAILS, LOAD_OWN_PLATFORM_DETAILS, REQUEST_OWN_PLATFORM_SELECTION, SELECT_OWN_PLATFORM } from 'app/redux/actions/own-platform/const';
import { COMPLETE_SAVING_TV_SHOW_SEASON, COMPLETE_TV_SHOW_SEASONS_HANDLING, LOAD_NEW_TV_SHOW_SEASON_DETAILS, LOAD_TV_SHOW_SEASON_DETAILS, START_TV_SHOW_SEASONS_HANDLING } from 'app/redux/actions/tv-show-season/const';
import { navigationService } from 'app/utilities/navigation-service';
import { AppScreens } from 'app/utilities/screens';
import { Action } from 'redux';
import { SagaIterator } from 'redux-saga';

/**
 * All actions that trigger navigation
 */
const navigationActions = [
	SELECT_CATEGORY,
	LOAD_NEW_CATEGORY_DETAILS,
	LOAD_CATEGORY_DETAILS,
	LOAD_NEW_MEDIA_ITEM_DETAILS,
	LOAD_MEDIA_ITEM_DETAILS,
	LOAD_NEW_GROUP_DETAILS,
	LOAD_GROUP_DETAILS,
	LOAD_NEW_OWN_PLATFORM_DETAILS,
	LOAD_OWN_PLATFORM_DETAILS,
	COMPLETE_SAVING_CATEGORY,
	COMPLETE_SAVING_MEDIA_ITEM,
	COMPLETE_SAVING_GROUP,
	COMPLETE_SAVING_OWN_PLATFORM,
	REQUEST_GROUP_SELECTION,
	REQUEST_OWN_PLATFORM_SELECTION,
	SELECT_GROUP,
	SELECT_OWN_PLATFORM,
	LOAD_NEW_TV_SHOW_SEASON_DETAILS,
	LOAD_TV_SHOW_SEASON_DETAILS,
	START_TV_SHOW_SEASONS_HANDLING,
	COMPLETE_SAVING_TV_SHOW_SEASON,
	COMPLETE_TV_SHOW_SEASONS_HANDLING
];

/**
 * Worker saga that changes app screen
 * @param action the intercepted action
 */
const navigationSaga = function * (action: Action): SagaIterator {
	
	try {

		switch(action.type) {
			
			case SELECT_CATEGORY: {

				yield call(navigationService.navigate.bind(navigationService), AppScreens.MediaItemsList);
				break;
			}

			case LOAD_NEW_CATEGORY_DETAILS:
			case LOAD_CATEGORY_DETAILS: {

				yield call(navigationService.navigate.bind(navigationService), AppScreens.CategoryDetails);
				break;
			}

			case LOAD_NEW_MEDIA_ITEM_DETAILS:
			case LOAD_MEDIA_ITEM_DETAILS: {

				yield call(navigationService.navigate.bind(navigationService), AppScreens.MediaItemDetails);
				break;
			}

			case REQUEST_GROUP_SELECTION: {

				yield call(navigationService.navigate.bind(navigationService), AppScreens.GroupsList);
				break;
			}

			case REQUEST_OWN_PLATFORM_SELECTION: {

				yield call(navigationService.navigate.bind(navigationService), AppScreens.OwnPlatformsList);
				break;
			}

			case SELECT_GROUP: {

				yield call(navigationService.back.bind(navigationService));
				break;
			}

			case SELECT_OWN_PLATFORM: {

				yield call(navigationService.back.bind(navigationService));
				break;
			}

			case LOAD_NEW_TV_SHOW_SEASON_DETAILS:
			case LOAD_TV_SHOW_SEASON_DETAILS: {
				
				yield call(navigationService.navigate.bind(navigationService), AppScreens.TvShowSeasonDetails);
				break;
			}

			case LOAD_NEW_GROUP_DETAILS:
			case LOAD_GROUP_DETAILS: {
				
				yield call(navigationService.navigate.bind(navigationService), AppScreens.GroupDetails);
				break;
			}

			case LOAD_NEW_OWN_PLATFORM_DETAILS:
			case LOAD_OWN_PLATFORM_DETAILS: {
				
				yield call(navigationService.navigate.bind(navigationService), AppScreens.OwnPlatformDetails);
				break;
			}

			case COMPLETE_SAVING_CATEGORY:
			case COMPLETE_SAVING_MEDIA_ITEM:
			case COMPLETE_SAVING_GROUP:
			case COMPLETE_SAVING_OWN_PLATFORM:
			case COMPLETE_SAVING_TV_SHOW_SEASON: {

				yield call(navigationService.back.bind(navigationService));
				break;
			}

			case START_TV_SHOW_SEASONS_HANDLING: {

				yield call(navigationService.navigate.bind(navigationService), AppScreens.TvShowSeasonsList);
				break;
			}

			case COMPLETE_TV_SHOW_SEASONS_HANDLING: {

				yield call(navigationService.back.bind(navigationService));
				break;
			}

			default: {

				throw AppError.GENERIC.withDetails(`Action ${action.type} does not have a defined navigation behavior`);
			}
		}
	}
	catch(error) {

		yield put(setError(AppError.GENERIC.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the navigation actions
 */
export const watchNavigationSaga = function * (): SagaIterator {

	yield takeLatest(navigationActions, navigationSaga);
};
