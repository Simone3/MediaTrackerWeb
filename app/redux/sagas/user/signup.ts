import { call, put, takeLatest } from '@redux-saga/core/effects';
import { userController } from 'app/controllers/core/entities/user';
import { AppError } from 'app/data/models/internal/error';
import { UserInternal } from 'app/data/models/internal/user';
import { setError } from 'app/redux/actions/error/generators';
import { SIGN_USER_UP } from 'app/redux/actions/user/const';
import { completeSigningUserUp, failSigningUserUp, startSigningUserUp } from 'app/redux/actions/user/generators';
import { SignUserUpAction } from 'app/redux/actions/user/types';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that signs a user up
 * @param action the action
 */
const userSignupSaga = function * (action: SignUserUpAction): SagaIterator {

	yield put(startSigningUserUp());

	try {

		// Sign user up
		const user: UserInternal = yield call(userController.signup.bind(userController), action.user);
		yield put(completeSigningUserUp(user));
	}
	catch(error) {

		yield put(failSigningUserUp());
		
		yield put(setError(AppError.BACKEND_USER_SIGNUP.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the user signup actions
 */
export const watchUserSignupSaga = function * (): SagaIterator {

	yield takeLatest(SIGN_USER_UP, userSignupSaga);
};
