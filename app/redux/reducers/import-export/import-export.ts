import { COMPLETE_IMPORTING_OLD_APP_EXPORT, FAIL_IMPORTING_OLD_APP_EXPORT, START_IMPORTING_OLD_APP_EXPORT } from 'app/redux/actions/import-export/const';
import { ImportExportState } from 'app/redux/state/import-export';
import { Action } from 'redux';

/**
 * The initial state for the import-export state
 */
const initialState: ImportExportState = {
	status: 'IDLE'
};

/**
 * Reducer for the import-export state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const importExport = (state: ImportExportState = initialState, action: Action): ImportExportState => {
	
	switch(action.type) {

		// When the app starts an import, the status changes to show the loading indicator
		case START_IMPORTING_OLD_APP_EXPORT: {

			return {
				...state,
				status: 'IN_PROGRESS'
			};
		}
	
		// When the app completes an import, the status is reset
		case COMPLETE_IMPORTING_OLD_APP_EXPORT: {
			
			return {
				...state,
				status: 'COMPLETED'
			};
		}

		// When the app fails to an import, the status is reset (an error is shown by the global handler)
		case FAIL_IMPORTING_OLD_APP_EXPORT: {

			return {
				...state,
				status: 'COMPLETED'
			};
		}

		default:
			return state;
	}
};
