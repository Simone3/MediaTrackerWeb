import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { categoryController } from 'app/controllers/core/entities/category';
import { AppError } from 'app/data/models/internal/error';
import { DELETE_CATEGORY } from 'app/redux/actions/category/const';
import { completeDeletingCategory, failDeletingCategory, startDeletingCategory } from 'app/redux/actions/category/generators';
import { DeleteCategoryAction } from 'app/redux/actions/category/types';
import { setError } from 'app/redux/actions/error/generators';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that deletes a category
 * @param action the intercepted action
 */
const deleteCategorySaga = function * (action: DeleteCategoryAction): SagaIterator {

	yield put(startDeletingCategory());

	try {

		// Get values from state
		const state: State = yield select();
		const user = state.userGlobal.user;
		if(!user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while deleting category');
		}

		// Delete category
		yield call(categoryController.deleteCategory.bind(categoryController), user.id, action.category.id);
		yield put(completeDeletingCategory());
	}
	catch(error) {

		yield put(failDeletingCategory());
		
		yield put(setError(AppError.BACKEND_CATEGORY_DELETE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the delete category actions
 */
export const watchDeleteCategorySaga = function * (): SagaIterator {

	yield takeLatest(DELETE_CATEGORY, deleteCategorySaga);
};
