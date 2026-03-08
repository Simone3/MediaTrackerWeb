import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { groupController } from 'app/controllers/core/entities/group';
import { AppError } from 'app/data/models/internal/error';
import { setError } from 'app/redux/actions/error/generators';
import { DELETE_GROUP } from 'app/redux/actions/group/const';
import { completeDeletingGroup, failDeletingGroup, startDeletingGroup } from 'app/redux/actions/group/generators';
import { DeleteGroupAction } from 'app/redux/actions/group/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that deletes a group
 * @param action the intercepted action
 */
const deleteGroupSaga = function * (action: DeleteGroupAction): SagaIterator {

	yield put(startDeletingGroup());

	try {

		// Get values from state
		const state: State = yield select();
		const category = state.categoryGlobal.selectedCategory;
		const user = state.userGlobal.user;
		if(!category || !user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while deleting group');
		}

		// Delete the group
		yield call(groupController.deleteGroup.bind(groupController), user.id, category.id, action.group.id);
		yield put(completeDeletingGroup(action.group.id));
	}
	catch(error) {

		yield put(failDeletingGroup());
		
		yield put(setError(AppError.BACKEND_GROUP_DELETE.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the delete group actions
 */
export const watchDeleteGroupSaga = function * (): SagaIterator {

	yield takeLatest(DELETE_GROUP, deleteGroupSaga);
};
