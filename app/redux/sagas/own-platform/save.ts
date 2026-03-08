import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { ownPlatformController } from 'app/controllers/core/entities/own-platform';
import { AppError } from 'app/data/models/internal/error';
import { OwnPlatformFilterInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { setError } from 'app/redux/actions/error/generators';
import { SAVE_OWN_PLATFORM } from 'app/redux/actions/own-platform/const';
import { askConfirmationBeforeSavingOwnPlatform, completeSavingOwnPlatform, failSavingOwnPlatform, startSavingOwnPlatform } from 'app/redux/actions/own-platform/generators';
import { SaveOwnPlatformAction } from 'app/redux/actions/own-platform/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that saves a own platform
 * @param action the intercepted action
 */
const saveOwnPlatformSaga = function * (action: SaveOwnPlatformAction): SagaIterator {

	const ownPlatform = action.ownPlatform;

	yield put(startSavingOwnPlatform(ownPlatform));

	// Get values from state
	const state: State = yield select();
	const category = state.categoryGlobal.selectedCategory;
	const user = state.userGlobal.user;
	if(!category || !user) {

		throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while saving own platform');
	}

	try {

		// If we are adding a new own platform and the user has not confirmed a same-name creation...
		if(!ownPlatform.id && !action.confirmSameName) {

			// Check if there are other own platforms with the same name
			const filter: OwnPlatformFilterInternal = {
				name: ownPlatform.name
			};
			const mediaItemsWithSameName: OwnPlatformInternal[] = yield call(ownPlatformController.filter.bind(ownPlatformController), user.id, category.id, filter);
			
			// If so, dispatch confirmation request action and exit
			if(mediaItemsWithSameName.length > 0) {

				yield put(askConfirmationBeforeSavingOwnPlatform());
				return;
			}
		}

		// Save the own platform
		yield call(ownPlatformController.saveOwnPlatform.bind(ownPlatformController), user.id, category.id, ownPlatform);
		yield put(completeSavingOwnPlatform(ownPlatform));
	}
	catch(error) {

		// Send the failure action
		yield put(failSavingOwnPlatform());
		yield put(setError(AppError.BACKEND_OWN_PLATFORM_SAVE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the save own platform actions
 */
export const watchSaveOwnPlatformSaga = function * (): SagaIterator {

	yield takeLatest(SAVE_OWN_PLATFORM, saveOwnPlatformSaga);
};
