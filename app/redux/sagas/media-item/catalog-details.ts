import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { SagaIterator } from 'redux-saga';
import { AppError } from 'app/data/models/internal/error';
import { CatalogMediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { mediaItemCatalogControllerFactory } from 'app/controllers/main/entities/media-items/factories';
import { setError } from 'app/redux/actions/error/generators';
import { GET_MEDIA_ITEM_CATALOG_DETAILS } from 'app/redux/actions/media-item/const';
import { completeGettingMediaItemCatalogDetails, failGettingMediaItemCatalogDetails, startGettingMediaItemCatalogDetails } from 'app/redux/actions/media-item/generators';
import { GetMediaItemCatalogDetailsAction } from 'app/redux/actions/media-item/types';
import { State } from 'app/redux/state/state';

/**
 * Worker saga that gets the media item catalog details
 * @param action the intercepted action
 */
const getMediaItemCatalogDetailsSaga = function * (action: GetMediaItemCatalogDetailsAction): SagaIterator {
	yield put(startGettingMediaItemCatalogDetails());

	try {
		// Get values from state
		const state = (yield select()) as State;
		const category = state.categoryGlobal.selectedCategory;
		if (!category) {
			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find category while getting media item catalog details');
		}
		
		// Get the correct controller for the current category
		const catalogController = mediaItemCatalogControllerFactory.get(category);

		// Retrieve catalog details from controller
		const catalogId = action.catalogId;
		const catalogDetails = (yield call(catalogController.getDetails.bind(catalogController), catalogId)) as CatalogMediaItemInternal;
		yield put(completeGettingMediaItemCatalogDetails(catalogDetails));
	}
	catch(error) {
		yield put(failGettingMediaItemCatalogDetails());
		
		yield put(setError(AppError.BACKEND_MEDIA_ITEM_CATALOG_DETAILS.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the get media item catalog details actions
 */
export const watchGetMediaItemCatalogDetailsSaga = function * (): SagaIterator {
	yield takeLatest(GET_MEDIA_ITEM_CATALOG_DETAILS, getMediaItemCatalogDetailsSaga);
};
