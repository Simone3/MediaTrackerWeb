import { config } from 'app/config/config';
import { server } from 'app/server/server';

let serverInstance: ReturnType<typeof server.listen>;

/**
 * Helper to start the Express server
 */
export const setupTestServer = (): void => {
	// Init server on startup
	before((done) => {
		serverInstance = server.listen(config.server.port, () => {
			done();
		});
	});

	// Close server connection at the end
	after((done) => {
		serverInstance.close();
		done();
	});
};

/**
 * Getter for the current test server
 * @returns the test server instance
 */
export const getTestServer = (): ReturnType<typeof server.listen> => {
	return serverInstance;
};
