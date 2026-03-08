/**
 * Portion of the internal state with the bulk import-export information
 */
export type ImportExportState = {

	/**
	 * The current status of the import-export operations
	 */
	readonly status: ImportExportStatus;
}

/**
 * The current status of the import-export operations
 */
export type ImportExportStatus = 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';
