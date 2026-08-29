import { AppError } from 'app/data/models/internal/error';
import { getErrorHint } from 'app/utilities/error-hint';

describe('getErrorHint', () => {
	test('maps known Firebase Auth error codes', () => {
		expect(getErrorHint({
			name: 'FirebaseError',
			code: 'auth/email-already-in-use'
		})).toEqual({
			key: 'error.flash.hints.firebaseEmailAlreadyInUse'
		});
	});

	test('falls back to the raw code for unknown Firebase Auth errors', () => {
		expect(getErrorHint({
			name: 'FirebaseError',
			code: 'auth/some-new-code'
		})).toEqual({
			key: 'error.flash.hints.firebaseUnknown',
			params: {
				code: 'some-new-code'
			}
		});
	});

	test('maps the back-end error code of the response payload', () => {
		expect(getErrorHint({
			isAxiosError: true,
			response: {
				status: 500,
				data: {
					errorCode: 'db.delete.not.empty',
					errorDescription: 'The entity that is being deleted contains sub-items'
				}
			}
		})).toEqual({
			key: 'error.flash.hints.backEndDatabaseNotEmpty'
		});
	});

	test('falls back to the HTTP status when the back-end error code is unknown or missing', () => {
		expect(getErrorHint({
			isAxiosError: true,
			response: {
				status: 502,
				data: {
					errorCode: 'some.new.code'
				}
			}
		})).toEqual({
			key: 'error.flash.hints.backEndStatus',
			params: {
				status: '502'
			}
		});

		expect(getErrorHint({
			isAxiosError: true,
			response: {
				status: 503,
				data: ''
			}
		})).toEqual({
			key: 'error.flash.hints.backEndStatus',
			params: {
				status: '503'
			}
		});
	});

	test('reports an unreachable server when the request got no response', () => {
		expect(getErrorHint({
			isAxiosError: true,
			code: 'ERR_NETWORK'
		})).toEqual({
			key: 'error.flash.hints.backEndUnreachable'
		});
	});

	test('returns no hint for unrecognized errors', () => {
		expect(getErrorHint(undefined)).toBeUndefined();
		expect(getErrorHint('some string')).toBeUndefined();
		expect(getErrorHint(new Error('some error'))).toBeUndefined();
		expect(getErrorHint({
			code: 'ENOENT'
		})).toBeUndefined();
	});
});

describe('AppError user hints', () => {
	test('extracts the hint from the source error details', () => {
		const error = AppError.BACKEND_USER_SIGNUP.withDetails({
			name: 'FirebaseError',
			code: 'auth/email-already-in-use'
		});

		expect(error.userHint).toEqual({
			key: 'error.flash.hints.firebaseEmailAlreadyInUse'
		});
	});

	test('keeps the hint of the error constant when it declares one', () => {
		const error = AppError.BACKEND_TIMEOUT.withDetails({
			isAxiosError: true,
			code: 'ECONNABORTED'
		});

		expect(error.userHint).toEqual({
			key: 'error.flash.hints.backEndTimeout'
		});
	});

	test('has no hint when the details are a developer message', () => {
		expect(AppError.GENERIC.withDetails('Season not found').userHint).toBeUndefined();
	});
});
