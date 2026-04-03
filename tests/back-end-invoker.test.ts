jest.mock('app/config/config', () => ({
	config: {
		backEnd: {
			assumeWellFormedResponse: false
		}
	}
}));

jest.mock('app/controllers/main/common/rest-json-invoker', () => ({
	restJsonInvoker: {
		invoke: jest.fn()
	}
}));

jest.mock('app/controllers/main/entities/user', () => ({
	userController: {
		getCurrentUserAccessToken: jest.fn()
	}
}));

import { BackEndInvokerRestJson } from 'app/controllers/implementations/real/common/back-end-invoker';

const restJsonInvokerMock = jest.requireMock('app/controllers/main/common/rest-json-invoker') as {
	restJsonInvoker: {
		invoke: jest.Mock;
	};
};
const userControllerMock = jest.requireMock('app/controllers/main/entities/user') as {
	userController: {
		getCurrentUserAccessToken: jest.Mock;
	};
};

describe('BackEndInvokerRestJson', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		restJsonInvokerMock.restJsonInvoker.invoke.mockResolvedValue({ ok: true });
		userControllerMock.userController.getCurrentUserAccessToken.mockResolvedValue('token-123');
	});

	it('adds the Firebase bearer token to backend requests', async () => {
		const invoker = new BackEndInvokerRestJson();

		await invoker.invoke({
			method: 'GET',
			url: 'http://localhost:3000/users/test-user/categories',
			responseBodyClass: class TestResponse {}
		});

		expect(userControllerMock.userController.getCurrentUserAccessToken).toHaveBeenCalledTimes(1);
		expect(restJsonInvokerMock.restJsonInvoker.invoke).toHaveBeenCalledWith(expect.objectContaining({
			assumeWellFormedResponse: false,
			headers: expect.objectContaining({
				Authorization: 'Bearer token-123'
			})
		}));
	});
});
