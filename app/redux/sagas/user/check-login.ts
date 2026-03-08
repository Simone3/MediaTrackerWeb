import { call, put, takeLatest } from '@redux-saga/core/effects';
import { userController } from 'app/controllers/core/entities/user';
import { AppError } from 'app/data/models/internal/error';
import { UserInternal } from 'app/data/models/internal/user';
import { setError } from 'app/redux/actions/error/generators';
import { CHECK_USER_LOGIN_STATUS } from 'app/redux/actions/user/const';
import { completeCheckingUserLoginStatus, failCheckingUserLoginStatus, startCheckingUserLoginStatus } from 'app/redux/actions/user/generators';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that checks the user login status
 */
const checkUserLoginStatusSaga = function * (): SagaIterator {

	yield put(startCheckingUserLoginStatus());

	try {

		// Get user saved on device
		const user: UserInternal | undefined = yield call(userController.getCurrentUser.bind(userController));
		yield put(completeCheckingUserLoginStatus(user));
	}
	catch(error) {

		yield put(failCheckingUserLoginStatus());
		
		yield put(setError(AppError.BACKEND_USER_CHECK_LOGIN_STATUS.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the check user login status actions
 */
export const watchCheckUserLoginStatusSaga = function * (): SagaIterator {

	yield takeLatest(CHECK_USER_LOGIN_STATUS, checkUserLoginStatusSaga);
};
