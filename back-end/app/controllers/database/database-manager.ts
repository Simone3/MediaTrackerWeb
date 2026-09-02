import { AppError } from 'app/data/models/error/error';
import { logger } from 'app/loggers/logger';
import mongoose from 'mongoose';

/**
 * Database controller that handles generic DB setup, like its connection
 */
class DatabaseManager {
	/**
	 * Initializes the database connection
	 * @param databaseUrl the database URL
	 * @returns a void promise that resolves when connection is ready
	 */
	public initConnection(databaseUrl: string): Promise<void> {
		return new Promise((resolve, reject): void => {
			logger.info('Starting database connection...');

			mongoose.connect(databaseUrl);
	
			const db = mongoose.connection;
	
			db.on('error', (error): void => {
				logger.error('Database connection error: %s', error);
				reject(AppError.DATABASE_INIT.withDetails(error));
			});
	
			db.once('open', (): void => {
				logger.info('Database connection opened');
				resolve();
			});
		});
	}

	/**
	 * Closes the database connection
	 * @returns a void promise that resolves when connection is closed
	 */
	public closeConnection(): Promise<void> {
		return mongoose.connection.close(false);
	}
}

export const databaseManager = new DatabaseManager();
