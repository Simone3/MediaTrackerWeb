import { Action } from 'redux';

/**
 * The import old Media Tracker app export action
 */
export type ImportOldAppExportAction = Action & {
	
	jsonFileUri: string;
};

/**
 * The start importing old Media Tracker app export action
 */
export type StartImportingOldAppExportAction = Action & {
	
};

/**
 * The complete importing old Media Tracker app export action
 */
export type CompleteImportingOldAppExportAction = Action & {
	
};

/**
 * The fail importing old Media Tracker app export action
 */
export type FailImportingOldAppExportAction = Action & {
	
};
