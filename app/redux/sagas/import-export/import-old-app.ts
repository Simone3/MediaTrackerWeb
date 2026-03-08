import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { importController } from 'app/controllers/core/import-export/import';
import { AppError } from 'app/data/models/internal/error';
import { setError } from 'app/redux/actions/error/generators';
import { IMPORT_OLD_APP_EXPORT } from 'app/redux/actions/import-export/const';
import { completeImportingOldAppExport, failImportingOldAppExport, startImportingOldAppExport } from 'app/redux/actions/import-export/generators';
import { ImportOldAppExportAction } from 'app/redux/actions/import-export/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that imports the old Media Tracker app exports
 * @param action the intercepted action
 */
const importOldAppExportSaga = function * (action: ImportOldAppExportAction): SagaIterator {

	yield put(startImportingOldAppExport());

	try {

		// Get values from state
		const state: State = yield select();
		const user = state.userGlobal.user;
		if(!user) {

			throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while importing the old app export');
		}

		// Import the old app export
		yield call(importController.importOldAppExport.bind(importController), user.id, action.jsonFileUri);
		yield put(completeImportingOldAppExport());
	}
	catch(error) {

		yield put(failImportingOldAppExport());
		
		yield put(setError(AppError.BACKEND_IMPORT_OLD_APP.withDetails(error)));
	}
};

/**
 * Watcher saga that reacts to the import old Media Tracker app export actions
 */
export const watchImportOldAppExportSaga = function * (): SagaIterator {

	yield takeLatest(IMPORT_OLD_APP_EXPORT, importOldAppExportSaga);
};
