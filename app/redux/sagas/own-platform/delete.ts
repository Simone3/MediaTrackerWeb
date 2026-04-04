import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { SagaIterator } from 'redux-saga';
import { ownPlatformController } from 'app/controllers/main/entities/own-platform';
import { AppError } from 'app/data/models/internal/error';
import { setError } from 'app/redux/actions/error/generators';
import { DELETE_OWN_PLATFORM } from 'app/redux/actions/own-platform/const';
import { completeDeletingOwnPlatform, failDeletingOwnPlatform, startDeletingOwnPlatform } from 'app/redux/actions/own-platform/generators';
import { DeleteOwnPlatformAction } from 'app/redux/actions/own-platform/types';
import { State } from 'app/redux/state/state';

/**
 * Worker saga that deletes a own platform
 * @param action the intercepted action
 */
const deleteOwnPlatformSaga = function * (action: DeleteOwnPlatformAction): SagaIterator {
	yield put(startDeletingOwnPlatform());

	try {
		// Get values from state
		const state = (yield select()) as State;
		const category = state.categoryGlobal.selectedCategory;
		const user = state.userGlobal.user;
		if(!category || !user) {
			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while deleting own platform');
		}

		// Delete the own platform
		yield call(ownPlatformController.deleteOwnPlatform.bind(ownPlatformController), user.id, category.id, action.ownPlatform.id);
		yield put(completeDeletingOwnPlatform(action.ownPlatform.id));
	}
	catch(error) {
		yield put(failDeletingOwnPlatform());
		
		yield put(setError(AppError.BACKEND_OWN_PLATFORM_DELETE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the delete own platform actions
 */
export const watchDeleteOwnPlatformSaga = function * (): SagaIterator {
	yield takeLatest(DELETE_OWN_PLATFORM, deleteOwnPlatformSaga);
};
