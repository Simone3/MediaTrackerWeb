jest.mock('app/config/config', () => ({
	config: {
		backEnd: {
			defaultTimeoutMilliseconds: 1000
		},
		logging: {
			logInvocations: false
		}
	}
}));

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

import { RestJsonInvokerAxios } from 'app/controllers/implementations/real/common/rest-json-invoker';

const axiosMock = jest.requireMock('axios') as {
	default: {
		request: jest.Mock;
		CancelToken: {
			source: jest.Mock;
		};
	};
};

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

	test('does not send the browser-forbidden Accept-Charset header', async () => {
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
});
