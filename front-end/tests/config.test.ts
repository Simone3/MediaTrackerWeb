describe('app config', () => {
	const runtime = globalThis as {
		__MEDIA_TRACKER_ENV__?: { [key: string]: string | undefined };
		process?: {
			env?: { [key: string]: string | undefined };
		};
	};

	afterEach(() => {
		delete runtime.__MEDIA_TRACKER_ENV__;

		if(runtime.process?.env) {
			delete runtime.process.env.MEDIA_TRACKER_APP_ENV;
			delete runtime.process.env.MEDIA_TRACKER_BACK_END_BASE_URL;
		}

		jest.resetModules();
	});

	it('defaults to dev config when no environment override is available', () => {
		const { config } = require('app/config/config');
		const { devConfig } = require('app/config/properties/config-dev');

		expect(config).toEqual(devConfig);
	});

	it('uses the runtime MEDIA_TRACKER_APP_ENV override when it is present', () => {
		runtime.__MEDIA_TRACKER_ENV__ = {
			MEDIA_TRACKER_APP_ENV: 'prod'
		};

		const { config } = require('app/config/config');
		const { prodConfig } = require('app/config/properties/config-prod');

		expect(config).toEqual(prodConfig);
	});

	it('uses the runtime MEDIA_TRACKER_BACK_END_BASE_URL override in prod config', () => {
		runtime.__MEDIA_TRACKER_ENV__ = {
			MEDIA_TRACKER_APP_ENV: 'prod',
			MEDIA_TRACKER_BACK_END_BASE_URL: 'https://api.example.com'
		};

		const { config } = require('app/config/config');

		expect(config.backEnd.baseUrl).toBe('https://api.example.com');
	});
});
