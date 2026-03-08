import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemFilterInternal, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { mediaItemControllerFactory } from 'app/factories/controller-factories';
import { setError } from 'app/redux/actions/error/generators';
import { SAVE_MEDIA_ITEM } from 'app/redux/actions/media-item/const';
import { askConfirmationBeforeSavingMediaItem, completeSavingMediaItem, failSavingMediaItem, startSavingMediaItem } from 'app/redux/actions/media-item/generators';
import { SaveMediaItemAction } from 'app/redux/actions/media-item/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that saves a media item
 * @param action the intercepted action
 */
const saveMediaItemSaga = function * (action: SaveMediaItemAction): SagaIterator {

	const mediaItem = action.mediaItem;

	yield put(startSavingMediaItem(mediaItem));

	// Get linked controller
	const mediaItemController = mediaItemControllerFactory.get(mediaItem.mediaType);
	
	// Get values from state
	const state: State = yield select();
	const category = state.categoryGlobal.selectedCategory;
	const user = state.userGlobal.user;
	if(!category || !user) {

		throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while saving media item');
	}

	try {

		// If we are adding a new media item and the user has not confirmed a same-name creation...
		if(!mediaItem.id && !action.confirmSameName) {

			// Check if there are other media items with the same name
			const filter: MediaItemFilterInternal = {
				name: mediaItem.name
			};
			const mediaItemsWithSameName: MediaItemInternal[] = yield call(mediaItemController.filter.bind(mediaItemController), user.id, category.id, filter);
			
			// If so, dispatch confirmation request action and exit
			if(mediaItemsWithSameName.length > 0) {

				yield put(askConfirmationBeforeSavingMediaItem());
				return;
			}
		}

		// Save the media item
		yield call(mediaItemController.save.bind(mediaItemController), user.id, category.id, mediaItem);
		yield put(completeSavingMediaItem());
	}
	catch(error) {

		// Send the failure action
		yield put(failSavingMediaItem());
		yield put(setError(AppError.BACKEND_MEDIA_ITEM_SAVE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the save media item actions
 */
export const watchSaveMediaItemSaga = function * (): SagaIterator {

	yield takeLatest(SAVE_MEDIA_ITEM, saveMediaItemSaga);
};
