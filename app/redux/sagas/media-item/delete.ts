import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { mediaItemControllerFactory } from 'app/factories/controller-factories';
import { setError } from 'app/redux/actions/error/generators';
import { DELETE_MEDIA_ITEM } from 'app/redux/actions/media-item/const';
import { completeDeletingMediaItem, failDeletingMediaItem, startDeletingMediaItem } from 'app/redux/actions/media-item/generators';
import { DeleteMediaItemAction } from 'app/redux/actions/media-item/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that deletes a media item
 * @param action the intercepted action
 */
const deleteMediaItemSaga = function * (action: DeleteMediaItemAction): SagaIterator {

	yield put(startDeletingMediaItem());

	try {

		// Get values from state
		const state: State = yield select();
		const category = state.categoryGlobal.selectedCategory;
		const user = state.userGlobal.user;
		if(!category || !user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while deleting media item');
		}
		
		// Get the correct controller for the current category
		const mediaItemController = mediaItemControllerFactory.get(category);

		// Delete the media item
		yield call(mediaItemController.delete.bind(mediaItemController), user.id, category.id, action.mediaItem.id);
		yield put(completeDeletingMediaItem());
	}
	catch(error) {

		yield put(failDeletingMediaItem());
		
		yield put(setError(AppError.BACKEND_MEDIA_ITEM_DELETE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the delete media item actions
 */
export const watchDeleteMediaItemSaga = function * (): SagaIterator {

	yield takeLatest(DELETE_MEDIA_ITEM, deleteMediaItemSaga);
};
