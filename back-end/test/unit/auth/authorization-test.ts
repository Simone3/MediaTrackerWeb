import { userResourceAuthorizationMiddleware } from 'app/auth/authorization';
import chai from 'chai';
import { NextFunction, Request, Response } from 'express-serve-static-core';

const expect = chai.expect;

/**
 * Tests for the authorization middleware
 */
describe('Authorization Middleware Tests', () => {
	describe('Authorization Middleware Tests', () => {
		it('Should return a generic forbidden response if configured incorrectly', () => {
			const request = {
				params: {}
			} as unknown as Request;

			let actualStatus: number | undefined;
			let actualBody: unknown;
			let calledNext = false;
			const response = {
				status: (statusCode: number) => {
					actualStatus = statusCode;
					return response;
				},
				send: (body: unknown) => {
					actualBody = body;
					return response;
				}
			} as unknown as Response;
			const next: NextFunction = () => {
				calledNext = true;
			};

			userResourceAuthorizationMiddleware(request, response, next);

			expect(actualStatus, 'Authorization middleware returned the wrong status').to.equal(403);
			expect(actualBody, 'Authorization middleware returned sensitive details').to.eql({ error: 'Forbidden' });
			expect(calledNext, 'Authorization middleware continued after an error').to.equal(false);
		});
	});
});
