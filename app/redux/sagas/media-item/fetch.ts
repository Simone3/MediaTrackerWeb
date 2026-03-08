import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemFilterInternal, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { mediaItemControllerFactory, mediaItemDefinitionsControllerFactory } from 'app/factories/controller-factories';
import { setError } from 'app/redux/actions/error/generators';
import { FETCH_MEDIA_ITEMS, SEARCH_MEDIA_ITEMS, START_MEDIA_ITEMS_VIEW_GROUP_MODE } from 'app/redux/actions/media-item/const';
import { completeFetchingMediaItems, failFetchingMediaItems, startFetchingMediaItems } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that fetches the media items
 */
const fetchMediaItemsSaga = function * (): SagaIterator {

	yield put(startFetchingMediaItems());

	try {
		
		// Get values from state
		const state: State = yield select();
		const mode = state.mediaItemsList.mode;
		const category = state.categoryGlobal.selectedCategory;
		const user = state.userGlobal.user;
		if(!category || !user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find category while fetching media items');
		}

		// Get the correct controllers for the current category
		const mediaItemDefinitionsController = mediaItemDefinitionsControllerFactory.get(category);
		const mediaItemController = mediaItemControllerFactory.get(category);

		// Retrieve media items from controller
		let mediaItems: MediaItemInternal[];
		switch(mode) {

			// Normal fetching mode is the standard one, based on the current filter and sort options
			case 'NORMAL': {

				const filter = state.mediaItemsList.filter;
				const sortBy = state.mediaItemsList.sortBy;
				if(!filter || !sortBy) {
		
					throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find filter and sort options');
				}

				mediaItems = yield call(mediaItemController.filter.bind(mediaItemController), user.id, category.id, filter, sortBy);

				break;
			}

			// Search fetching mode allows to search media items by term
			case 'SEARCH': {

				const term = state.mediaItemsList.searchTerm;
				if(!term) {
		
					throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find search term');
				}

				mediaItems = yield call(mediaItemController.search.bind(mediaItemController), user.id, category.id, term);

				break;
			}

			// View group fetching mode allows to list all media items in a group
			case 'VIEW_GROUP': {

				const viewGroup = state.mediaItemsList.viewGroup;
				if(!viewGroup) {
		
					throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find view group value');
				}

				const filter: MediaItemFilterInternal = {
					groups: {
						groupIds: [ viewGroup.id ]
					}
				};

				const sortBy = mediaItemDefinitionsController.getViewGroupSortBy();
				
				mediaItems = yield call(mediaItemController.filter.bind(mediaItemController), user.id, category.id, filter, sortBy);

				break;
			}

			default: {
				
				throw AppError.GENERIC.withDetails(`Mode ${mode} is not mapped in fetch saga`);
			}
		}

		// Get the media items and return them
		yield put(completeFetchingMediaItems(mediaItems));
	}
	catch(error) {

		yield put(failFetchingMediaItems());
		
		yield put(setError(AppError.BACKEND_MEDIA_ITEM_FETCH.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the fetch media items actions
 */
export const watchFetchMediaItemsSaga = function * (): SagaIterator {

	yield takeLatest([ FETCH_MEDIA_ITEMS, SEARCH_MEDIA_ITEMS, START_MEDIA_ITEMS_VIEW_GROUP_MODE ], fetchMediaItemsSaga);
};
