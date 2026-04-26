import { config } from 'app/config/config';
import mongoose from 'mongoose';

/**
 * Helper to start the MongoDB connection
 */
export const setupTestDatabaseConnection = (): void => {
	// Init connection on startup
	before((done) => {
		mongoose.connect(config.db.url)
			.then(() => {
				done();
			})
			.catch((error) => {
				done(`Test database connect error: ${error}`);
			});
	});

	// Drop database after each test
	afterEach((done) => {
		const database = mongoose.connection.db;

		if(!database) {
			done('Failed to drop database: database connection is not initialized');
			return;
		}

		database.dropDatabase()
			.then(() => {
				done();
			})
			.catch((error) => {
				done(`Failed to drop database: ${error}`);
			});
	});

	// Close connection at the end
	after((done) => {
		mongoose.connection.close()
			.then(() => {
				done();
			})
			.catch((error) => {
				done(`Failed to close connection: ${error}`);
			});
	});
};
