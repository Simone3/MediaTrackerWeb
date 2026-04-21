import { IsString } from 'class-validator';
import { RestJsonInvokerAxios } from 'app/controllers/implementations/real/common/rest-json-invoker';

const reflectMetadata = require('reflect-metadata');

void reflectMetadata;

class TestValidatedResponse {
	@IsString()
	public ok: string = '';
}

jest.mock('app/config/config', () => {
	return {
		config: {
			backEnd: {
				defaultTimeoutMilliseconds: 1000
			},
			logging: {
				logInvocations: false
			}
		}
	};
});

jest.mock('axios', () => {
	return {
		__esModule: true,
		default: {
			request: jest.fn(),
			CancelToken: {
				source: jest.fn(() => {
					return {
						token: 'token-123',
						cancel: jest.fn()
					};
				})
			}
		}
	};
});

const axiosMock = jest.requireMock('axios');

describe('RestJsonInvokerAxios', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.clearAllMocks();
		axiosMock.default.request.mockResolvedValue({
			data: {
				ok: true
			}
		});
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	test('does not send the browser-forbidden Accept-Charset header', async() => {
		const invoker = new RestJsonInvokerAxios();

		const response = await invoker.invoke({
			method: 'GET',
			url: 'http://localhost:3000/test',
			headers: {
				Authorization: 'Bearer token-123'
			},
			responseBodyClass: class TestResponse {},
			assumeWellFormedResponse: true
		});

		expect(response).toEqual({ ok: true });
		expect(axiosMock.default.request).toHaveBeenCalledTimes(1);

		const requestOptions = axiosMock.default.request.mock.calls[0][0];
		expect(requestOptions.headers).toEqual(expect.objectContaining({
			Authorization: 'Bearer token-123',
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}));
		expect(requestOptions.headers).not.toHaveProperty('Accept-Charset');
	});

	test('parses and validates the response body when the backend response is not assumed to be well formed', async() => {
		axiosMock.default.request.mockResolvedValue({
			data: {
				ok: 'validated'
			}
		});

		const invoker = new RestJsonInvokerAxios();

		const response = await invoker.invoke({
			method: 'GET',
			url: 'http://localhost:3000/test',
			responseBodyClass: TestValidatedResponse
		});

		expect(response).toBeInstanceOf(TestValidatedResponse);
		expect(response.ok).toBe('validated');
	});

	test('maps response parsing failures to the backend parse app error', async() => {
		axiosMock.default.request.mockResolvedValue({
			data: {
				ok: 123
			}
		});

		const invoker = new RestJsonInvokerAxios();

		await expect(invoker.invoke({
			method: 'GET',
			url: 'http://localhost:3000/test',
			responseBodyClass: TestValidatedResponse
		})).rejects.toMatchObject({
			errorCode: 'backend.parse'
		});
	});

	test('maps timeout cancellation errors to the backend timeout app error', async() => {
		axiosMock.default.request.mockRejectedValue({
			message: 'custom-timeout'
		});

		const invoker = new RestJsonInvokerAxios();

		await expect(invoker.invoke({
			method: 'GET',
			url: 'http://localhost:3000/test',
			responseBodyClass: class TestResponse {}
		})).rejects.toMatchObject({
			errorCode: 'backend.timeout'
		});
	});
});
