import { call, put, takeLatest } from '@redux-saga/core/effects';
import { userController } from 'app/controllers/core/entities/user';
import { AppError } from 'app/data/models/internal/error';
import { setError } from 'app/redux/actions/error/generators';
import { LOG_USER_OUT } from 'app/redux/actions/user/const';
import { completeLoggingUserOut, failLoggingUserOut, startLoggingUserOut } from 'app/redux/actions/user/generators';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that logs a user out
 */
const userLogoutSaga = function * (): SagaIterator {

	yield put(startLoggingUserOut());

	try {

		// Get user saved on device
		yield call(userController.logout.bind(userController));
		yield put(completeLoggingUserOut());
	}
	catch(error) {

		yield put(failLoggingUserOut());
		
		yield put(setError(AppError.BACKEND_USER_LOGOUT.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the user logout actions
 */
export const watchUserLogoutSaga = function * (): SagaIterator {

	yield takeLatest(LOG_USER_OUT, userLogoutSaga);
};
