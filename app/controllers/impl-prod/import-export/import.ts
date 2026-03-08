import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/core/common/back-end-invoker';
import { ImportController } from 'app/controllers/core/import-export/import';
import { ImportOldAppExportRequest, ImportOldAppExportResponse } from 'app/data/models/api/import/old-app/export';
import { AppError } from 'app/data/models/internal/error';
import { miscUtils } from 'app/utilities/misc-utils';
import { readFile } from 'react-native-fs';

/**
 * Implementation of the ImportController that queries the back-end APIs
 * @see ImportController
 */
export class ImportBackEndController implements ImportController {
	
	/**
	 * @override
	 */
	public async importOldAppExport(userId: string, jsonFileUri: string): Promise<void> {
	
		// Read the file contents as a string
		const content = await readFile(jsonFileUri);
		if(!content || !content.trim()) {

			throw AppError.IMPORT_FILE.withDetails(`JSON file is empty: ${content}`);
		}

		// Parse the file contents as a JavaScript object
		const parsedContent = JSON.parse(content);
		if(!parsedContent || typeof parsedContent !== 'object') {

			throw AppError.IMPORT_FILE.withDetails(`Parsed JSON file is not an object: ${parsedContent}`);
		}

		// Build back-end request
		const request: ImportOldAppExportRequest = {
			export: parsedContent,
			options: {
				defaultOwnPlatform: config.backEnd.bulkImport.defaultOwnPlatform
			}
		};

		// Invoke back-end APIs
		await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, '/users/:userId/import/old-app' ], {
				userId: userId
			}),
			requestBody: request,
			responseBodyClass: ImportOldAppExportResponse,
			timeoutMilliseconds: config.backEnd.bulkImport.timeoutMilliseconds
		});
	}
}
