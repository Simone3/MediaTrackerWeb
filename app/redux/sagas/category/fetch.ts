import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { categoryController } from 'app/controllers/core/entities/category';
import { CategoryInternal } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { FETCH_CATEGORIES } from 'app/redux/actions/category/const';
import { completeFetchingCategories, failFetchingCategories, startFetchingCategories } from 'app/redux/actions/category/generators';
import { setError } from 'app/redux/actions/error/generators';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that fetches the categories
 */
const fetchCategoriesSaga = function * (): SagaIterator {

	yield put(startFetchingCategories());

	try {

		// Get values from state
		const state: State = yield select();
		const user = state.userGlobal.user;
		if(!user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while fetching categories');
		}

		// Fetch categories
		const categories: CategoryInternal[] = yield call(categoryController.getAllCategories.bind(categoryController), user.id);
		yield put(completeFetchingCategories(categories));
	}
	catch(error) {

		yield put(failFetchingCategories());
		
		yield put(setError(AppError.BACKEND_CATEGORY_FETCH.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the fetch categories actions
 */
export const watchFetchCategoriesSaga = function * (): SagaIterator {

	yield takeLatest(FETCH_CATEGORIES, fetchCategoriesSaga);
};
