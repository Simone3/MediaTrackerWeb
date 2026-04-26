import { ErrorResponse } from 'app/data/models/api/common';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestServer } from 'helpers/server-handler-helper';

const expect = chai.expect;

/**
 * Tests for the final catch-all middleware
 */
describe('Catch-All API Tests', () => {
	setupTestServer();

	it('Should return not found for an unknown route when the request is authenticated', async() => {
		const response = await callHelper<undefined, ErrorResponse>('GET', '/unknown-test-route', 'test-user', undefined, {
			expectedStatus: 404
		});

		expect(response.errorCode, 'API did not return the expected error code').to.equal('api.not.found');
		expect(response.errorDescription, 'API did not return the expected error description').to.equal('Cannot find the requested API');
	});

	it('Should still require authentication before the final catch-all middleware', async() => {
		const response = await callHelper<undefined, { error: string }>('GET', '/unknown-test-route', 'test-user', undefined, {
			customAuthorizationHeader: '',
			expectedStatus: 401
		});

		expect(response.error, 'API did not return the expected auth error').to.equal('Unauthorized');
	});
});
