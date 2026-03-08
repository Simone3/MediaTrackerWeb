import { call, put, takeLatest } from '@redux-saga/core/effects';
import { userController } from 'app/controllers/core/entities/user';
import { AppError } from 'app/data/models/internal/error';
import { UserInternal } from 'app/data/models/internal/user';
import { setError } from 'app/redux/actions/error/generators';
import { LOG_USER_IN } from 'app/redux/actions/user/const';
import { completeLoggingUserIn, failLoggingUserIn, startLoggingUserIn } from 'app/redux/actions/user/generators';
import { LogUserInAction } from 'app/redux/actions/user/types';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that logs a user in
 * @param action the action
 */
const userLoginSaga = function * (action: LogUserInAction): SagaIterator {

	yield put(startLoggingUserIn());

	try {

		// Log user in
		const user: UserInternal = yield call(userController.login.bind(userController), action.user);
		yield put(completeLoggingUserIn(user));
	}
	catch(error) {

		yield put(failLoggingUserIn());
		
		yield put(setError(AppError.BACKEND_USER_LOGIN.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the user login actions
 */
export const watchUserLoginSaga = function * (): SagaIterator {

	yield takeLatest(LOG_USER_IN, userLoginSaga);
};
