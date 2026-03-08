import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { categoryController } from 'app/controllers/core/entities/category';
import { CategoryFilterInternal, CategoryInternal } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { SAVE_CATEGORY } from 'app/redux/actions/category/const';
import { askConfirmationBeforeSavingCategory, completeSavingCategory, failSavingCategory, startSavingCategory } from 'app/redux/actions/category/generators';
import { SaveCategoryAction } from 'app/redux/actions/category/types';
import { setError } from 'app/redux/actions/error/generators';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that saves a category
 * @param action the intercepted action
 */
const saveCategorySaga = function * (action: SaveCategoryAction): SagaIterator {

	const category = action.category;

	yield put(startSavingCategory(category));

	try {

		// Get values from state
		const state: State = yield select();
		const user = state.userGlobal.user;
		if(!user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while saving category');
		}

		// If we are adding a new category and the user has not confirmed a same-name creation...
		if(!category.id && !action.confirmSameName) {

			// Check if there are other categories with the same name
			const filter: CategoryFilterInternal = {
				name: category.name
			};
			const mediaItemsWithSameName: CategoryInternal[] = yield call(categoryController.filter.bind(categoryController), user.id, filter);
			
			// If so, dispatch confirmation request action and exit
			if(mediaItemsWithSameName.length > 0) {

				yield put(askConfirmationBeforeSavingCategory());
				return;
			}
		}

		// Save the category
		yield call(categoryController.saveCategory.bind(categoryController), user.id, category);
		yield put(completeSavingCategory());
	}
	catch(error) {

		// Send the failure action
		yield put(failSavingCategory());
		yield put(setError(AppError.BACKEND_CATEGORY_SAVE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the save category actions
 */
export const watchSaveCategorySaga = function * (): SagaIterator {

	yield takeLatest(SAVE_CATEGORY, saveCategorySaga);
};
