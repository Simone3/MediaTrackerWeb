import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { groupController } from 'app/controllers/core/entities/group';
import { AppError } from 'app/data/models/internal/error';
import { GroupFilterInternal, GroupInternal } from 'app/data/models/internal/group';
import { setError } from 'app/redux/actions/error/generators';
import { SAVE_GROUP } from 'app/redux/actions/group/const';
import { askConfirmationBeforeSavingGroup, completeSavingGroup, failSavingGroup, startSavingGroup } from 'app/redux/actions/group/generators';
import { SaveGroupAction } from 'app/redux/actions/group/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that saves a group
 * @param action the intercepted action
 */
const saveGroupSaga = function * (action: SaveGroupAction): SagaIterator {

	const group = action.group;

	yield put(startSavingGroup(group));

	// Get values from state
	const state: State = yield select();
	const category = state.categoryGlobal.selectedCategory;
	const user = state.userGlobal.user;
	if(!category || !user) {

		throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while saving group');
	}

	try {

		// If we are adding a new group and the user has not confirmed a same-name creation...
		if(!group.id && !action.confirmSameName) {

			// Check if there are other groups with the same name
			const filter: GroupFilterInternal = {
				name: group.name
			};
			const mediaItemsWithSameName: GroupInternal[] = yield call(groupController.filter.bind(groupController), user.id, category.id, filter);
			
			// If so, dispatch confirmation request action and exit
			if(mediaItemsWithSameName.length > 0) {

				yield put(askConfirmationBeforeSavingGroup());
				return;
			}
		}

		// Save the group
		yield call(groupController.saveGroup.bind(groupController), user.id, category.id, group);
		yield put(completeSavingGroup(group));
	}
	catch(error) {

		// Send the failure action
		yield put(failSavingGroup());
		yield put(setError(AppError.BACKEND_GROUP_SAVE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the save group actions
 */
export const watchSaveGroupSaga = function * (): SagaIterator {

	yield takeLatest(SAVE_GROUP, saveGroupSaga);
};
