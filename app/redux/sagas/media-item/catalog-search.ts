import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { mediaItemCatalogControllerFactory } from 'app/factories/controller-factories';
import { setError } from 'app/redux/actions/error/generators';
import { SEARCH_MEDIA_ITEMS_CATALOG } from 'app/redux/actions/media-item/const';
import { completeSearchingMediaItemsCatalog, failSearchingMediaItemsCatalog, startSearchingMediaItemsCatalog } from 'app/redux/actions/media-item/generators';
import { SearchMediaItemsCatalogAction } from 'app/redux/actions/media-item/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that searches the media items catalog
 * @param action the intercepted action
 */
const searchMediaItemsCatalogSaga = function * (action: SearchMediaItemsCatalogAction): SagaIterator {

	yield put(startSearchingMediaItemsCatalog());

	try {
		
		// Get values from state
		const state: State = yield select();
		const category = state.categoryGlobal.selectedCategory;
		if(!category) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find category while searching media items catalog');
		}
		
		// Get the correct controller for the current category
		const catalogController = mediaItemCatalogControllerFactory.get(category);

		// Retrieve catalog results from controller
		const term = action.term;
		const catalogResults: SearchMediaItemCatalogResultInternal[] = yield call(catalogController.search.bind(catalogController), term);

		// Send the results
		yield put(completeSearchingMediaItemsCatalog(catalogResults));
	}
	catch(error) {

		yield put(failSearchingMediaItemsCatalog());
		
		yield put(setError(AppError.BACKEND_MEDIA_ITEM_CATALOG_SEARCH.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the search media items catalog actions
 */
export const watchSearchMediaItemsCatalogSaga = function * (): SagaIterator {

	yield takeLatest(SEARCH_MEDIA_ITEMS_CATALOG, searchMediaItemsCatalogSaga);
};
