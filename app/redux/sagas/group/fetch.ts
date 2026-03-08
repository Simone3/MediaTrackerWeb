import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { groupController } from 'app/controllers/core/entities/group';
import { AppError } from 'app/data/models/internal/error';
import { GroupInternal } from 'app/data/models/internal/group';
import { setError } from 'app/redux/actions/error/generators';
import { FETCH_GROUPS } from 'app/redux/actions/group/const';
import { completeFetchingGroups, failFetchingGroups, startFetchingGroups } from 'app/redux/actions/group/generators';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that fetches the groups
 */
const fetchGroupsSaga = function * (): SagaIterator {

	yield put(startFetchingGroups());

	try {

		// Get values from state
		const state: State = yield select();
		const category = state.categoryGlobal.selectedCategory;
		const user = state.userGlobal.user;
		if(!category || !user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while fetching groups');
		}

		// Retrieve the groups
		const groups: GroupInternal[] = yield call(groupController.getAllGroups.bind(groupController), user.id, category.id);
		yield put(completeFetchingGroups(groups));
	}
	catch(error) {

		yield put(failFetchingGroups());
		
		yield put(setError(AppError.BACKEND_GROUP_FETCH.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the fetch groups actions
 */
export const watchFetchGroupsSaga = function * (): SagaIterator {

	yield takeLatest(FETCH_GROUPS, fetchGroupsSaga);
};
