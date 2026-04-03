import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { mediaItemControllerFactory } from 'app/controllers/main/entities/media-items/factories';
import { setError } from 'app/redux/actions/error/generators';
import { MARK_MEDIA_ITEM_AS_ACTIVE, MARK_MEDIA_ITEM_AS_COMPLETE, MARK_MEDIA_ITEM_AS_REDO } from 'app/redux/actions/media-item/const';
import { completeInlineUpdatingMediaItem, failInlineUpdatingMediaItem, startInlineUpdatingMediaItem } from 'app/redux/actions/media-item/generators';
import { MarkMediaItemAsActiveAction, MarkMediaItemAsCompleteAction, MarkMediaItemAsRedoAction } from 'app/redux/actions/media-item/types';
import { applyInlineMediaItemUpdate, InlineMediaItemUpdateActionType } from 'app/redux/sagas/media-item/inline-update-helper';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that updates a media item "inline" (with pre-defined changes from the list screen)
 * @param action the intercepted action
 */
const inlineMediaItemUpdateSaga = function * (action: MarkMediaItemAsActiveAction | MarkMediaItemAsCompleteAction | MarkMediaItemAsRedoAction): SagaIterator {
	yield put(startInlineUpdatingMediaItem());

	try {
		const mediaItem = applyInlineMediaItemUpdate(action.mediaItem, action.type as InlineMediaItemUpdateActionType);

		// Get values from state
		const state = (yield select()) as State;
		const category = state.categoryGlobal.selectedCategory;
		const user = state.userGlobal.user;
		if(!category || !user) {
			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while inline updating media item');
		}
		
		// Get the correct controller for the current category
		const mediaItemController = mediaItemControllerFactory.get(category);

		// Update the media item
		yield call(mediaItemController.save.bind(mediaItemController), user.id, category.id, mediaItem);
		yield put(completeInlineUpdatingMediaItem());
	}
	catch(error) {
		yield put(failInlineUpdatingMediaItem());
		
		yield put(setError(AppError.BACKEND_MEDIA_ITEM_SAVE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the inline media item update actions
 */
export const watchInlineMediaItemUpdateSaga = function * (): SagaIterator {
	yield takeLatest([ MARK_MEDIA_ITEM_AS_ACTIVE, MARK_MEDIA_ITEM_AS_COMPLETE, MARK_MEDIA_ITEM_AS_REDO ], inlineMediaItemUpdateSaga);
};
