import { config } from 'app/config/config';
import { ImportMockedController } from 'app/controllers/impl-mocks/import-export/import';
import { ImportBackEndController } from 'app/controllers/impl-prod/import-export/import';

/**
 * The controller for the bulk import functionalities
 */
export interface ImportController {

	/**
	 * Imports the old Media Tracker app export
	 * @param userId the user
	 * @param jsonFileUri the path of the JSON file to import
	 * @returns a void promise
	 */
	importOldAppExport(userId: string, jsonFileUri: string): Promise<void>;
}

/**
 * Singleton implementation of the bulk import controller
 */
export const importController: ImportController = config.mocks.import ? new ImportMockedController() : new ImportBackEndController();

