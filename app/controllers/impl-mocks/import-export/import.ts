import { ImportController } from 'app/controllers/core/import-export/import';
import { MockControllerHelper } from 'app/controllers/impl-mocks/common/mock-helper';

/**
 * Mocked implementation of the ImportController that fakes the bulk imports
 * @see ImportController
 */
export class ImportMockedController extends MockControllerHelper implements ImportController {
	
	protected delay = 10000;

	/**
	 * @override
	 */
	public importOldAppExport(userId: string, jsonFileUri: string): Promise<void> {
	
		return this.resolveResult(() => {

			console.log(`Mocked old app import: would import ${jsonFileUri} for user ${userId}`);
		});
	}
}
