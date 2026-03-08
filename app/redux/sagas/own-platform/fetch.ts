import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { ownPlatformController } from 'app/controllers/core/entities/own-platform';
import { AppError } from 'app/data/models/internal/error';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { setError } from 'app/redux/actions/error/generators';
import { FETCH_OWN_PLATFORMS } from 'app/redux/actions/own-platform/const';
import { completeFetchingOwnPlatforms, failFetchingOwnPlatforms, startFetchingOwnPlatforms } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that fetches the own platforms
 */
const fetchOwnPlatformsSaga = function * (): SagaIterator {

	yield put(startFetchingOwnPlatforms());

	try {

		// Get values from state
		const state: State = yield select();
		const category = state.categoryGlobal.selectedCategory;
		const user = state.userGlobal.user;
		if(!category || !user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while fetching own platforms');
		}

		// Retrieve the own platforms
		const ownPlatforms: OwnPlatformInternal[] = yield call(ownPlatformController.getAllOwnPlatforms.bind(ownPlatformController), user.id, category.id);
		yield put(completeFetchingOwnPlatforms(ownPlatforms));
	}
	catch(error) {

		yield put(failFetchingOwnPlatforms());
		
		yield put(setError(AppError.BACKEND_OWN_PLATFORM_FETCH.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the fetch own platforms actions
 */
export const watchFetchOwnPlatformsSaga = function * (): SagaIterator {

	yield takeLatest(FETCH_OWN_PLATFORMS, fetchOwnPlatformsSaga);
};
