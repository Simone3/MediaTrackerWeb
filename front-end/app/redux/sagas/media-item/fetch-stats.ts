import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { SagaIterator } from 'redux-saga';
import { mediaItemControllerFactory } from 'app/controllers/main/entities/media-items/factories';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemsStatsInternal } from 'app/data/models/internal/media-items/media-item';
import { setError } from 'app/redux/actions/error/generators';
import { FETCH_MEDIA_ITEMS_STATS } from 'app/redux/actions/media-item/const';
import { completeFetchingMediaItemsStats, failFetchingMediaItemsStats, startFetchingMediaItemsStats } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';

/**
 * Worker saga that fetches the media items stats
 */
const fetchMediaItemsStatsSaga = function * (): SagaIterator {
	yield put(startFetchingMediaItemsStats());

	try {
		// Get values from state
		const state = (yield select()) as State;
		const category = state.categoryGlobal.selectedCategory;
		const user = state.userGlobal.user;
		if(!category || !user) {
			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find category while fetching media items stats');
		}

		// Get the correct controller for the current category
		const mediaItemController = mediaItemControllerFactory.get(category);

		// Retrieve the stats from the controller
		const stats = (yield call(mediaItemController.getStats.bind(mediaItemController), user.id, category.id, state.mediaItemsStats.filter)) as MediaItemsStatsInternal;

		yield put(completeFetchingMediaItemsStats(stats));
	}
	catch(error) {
		yield put(failFetchingMediaItemsStats());

		yield put(setError(AppError.BACKEND_MEDIA_ITEM_STATS_FETCH.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the fetch media items stats actions
 */
export const watchFetchMediaItemsStatsSaga = function * (): SagaIterator {
	yield takeLatest(FETCH_MEDIA_ITEMS_STATS, fetchMediaItemsStatsSaga);
};
