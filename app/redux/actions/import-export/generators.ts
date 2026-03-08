import { COMPLETE_IMPORTING_OLD_APP_EXPORT, FAIL_IMPORTING_OLD_APP_EXPORT, IMPORT_OLD_APP_EXPORT, START_IMPORTING_OLD_APP_EXPORT } from 'app/redux/actions/import-export/const';
import { CompleteImportingOldAppExportAction, FailImportingOldAppExportAction, ImportOldAppExportAction, StartImportingOldAppExportAction } from 'app/redux/actions/import-export/types';

/**
 * Generator for the import old Media Tracker app export action, which causes the start importing action, the async import and then the complete import action
 * @param jsonFileUri the old app export JSON path
 * @returns the action
 */
export const importOldAppExport = (jsonFileUri: string): ImportOldAppExportAction => {
	
	return {
		type: IMPORT_OLD_APP_EXPORT,
		jsonFileUri: jsonFileUri
	};
};

/**
 * Generator for the start importing old Media Tracker app export action
 * @returns the action
 */
export const startImportingOldAppExport = (): StartImportingOldAppExportAction => {
	
	return {
		type: START_IMPORTING_OLD_APP_EXPORT
	};
};

/**
 * Generator for the complete importing old Media Tracker app export action
 * @returns the action
 */
export const completeImportingOldAppExport = (): CompleteImportingOldAppExportAction => {
	
	return {
		type: COMPLETE_IMPORTING_OLD_APP_EXPORT
	};
};

/**
 * Generator for the fail importing old Media Tracker app export action
 * @returns the action
 */
export const failImportingOldAppExport = (): FailImportingOldAppExportAction => {
	
	return {
		type: FAIL_IMPORTING_OLD_APP_EXPORT
	};
};
