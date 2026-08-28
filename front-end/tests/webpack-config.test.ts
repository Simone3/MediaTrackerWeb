type WebpackConfig = {
	output: {
		filename?: string;
		assetModuleFilename?: string;
	};
	module: {
		rules: Array<{
			test?: RegExp;
			type?: string;
			generator?: {
				dataUrl?: (content: Buffer) => string;
			};
			parser?: {
				dataUrlCondition?: {
					maxSize?: number;
				};
			};
		}>;
	};
	plugins: Array<{
		constructor?: {
			name?: string;
		};
		userOptions?: {
			template?: string;
			favicon?: string;
		};
		definitions?: {
			__MEDIA_TRACKER_APP_ENV__?: string;
			__MEDIA_TRACKER_BACK_END_BASE_URL__?: string;
		};
	}>;
};

type WebpackConfigFactory = (_env: unknown, argv: { mode: 'development' | 'production' }) => WebpackConfig;

const runtime = globalThis as {
	process?: {
		env?: { [key: string]: string | undefined };
	};
};

const getProcessEnv = (): { [key: string]: string | undefined } => {
	if(!runtime.process?.env) {
		throw new Error('process.env is not available');
	}

	return runtime.process.env;
};

const getWebpackConfig = (mode: 'development' | 'production') => {
	const webpackConfigFactory = require('../webpack.config') as WebpackConfigFactory;
	return webpackConfigFactory({}, { mode });
};

describe('webpack config', () => {
	afterEach(() => {
		delete getProcessEnv().MEDIA_TRACKER_APP_ENV;
		delete getProcessEnv().MEDIA_TRACKER_BACK_END_BASE_URL;
	});

	const getSvgRule = (webpackConfig: WebpackConfig) => {
		return webpackConfig.module.rules.find((rule) => {
			return rule.test?.test('icon.svg');
		});
	};

	it('emits every content-hashed output under assets/', () => {
		const webpackConfig = getWebpackConfig('production');

		expect(webpackConfig.output.filename).toBe('assets/bundle.[contenthash].js');
		expect(webpackConfig.output.assetModuleFilename).toBe('assets/[contenthash][ext]');
	});

	it('inlines svg icons instead of emitting them as separate files', () => {
		const webpackConfig = getWebpackConfig('production');

		expect(getSvgRule(webpackConfig)?.type).toBe('asset/inline');
	});

	it('inlines raster images only while they stay small', () => {
		const webpackConfig = getWebpackConfig('production');
		const rasterRule = webpackConfig.module.rules.find((rule) => {
			return rule.test?.test('picture.png');
		});

		expect(rasterRule?.type).toBe('asset');
		expect(rasterRule?.parser?.dataUrlCondition?.maxSize).toBe(4096);
	});

	it('escapes everything that would break an svg data uri inside an unquoted css url()', () => {
		const webpackConfig = getWebpackConfig('production');
		const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" transform="scale(2)" style="fill:#000"/></svg>';

		const dataUrl = getSvgRule(webpackConfig)?.generator?.dataUrl?.(Buffer.from(svg));

		expect(dataUrl).toMatch(/^data:image\/svg\+xml,/);
		expect(dataUrl).not.toMatch(/["'()\s#]/);
	});

	it('injects the app favicon into the generated html', () => {
		const webpackConfig = getWebpackConfig('development');
		const htmlWebpackPlugin = webpackConfig.plugins.find((plugin: { userOptions?: { template?: string; favicon?: string } }) => {
			return plugin?.userOptions?.template === 'public/index.html';
		});

		expect(htmlWebpackPlugin?.userOptions?.favicon).toBe('app/resources/images/ic_app_logo.png');
	});

	it('defaults MEDIA_TRACKER_APP_ENV to dev for development mode', () => {
		const webpackConfig = getWebpackConfig('development');
		const definePlugin = webpackConfig.plugins.find((plugin: { definitions?: { __MEDIA_TRACKER_APP_ENV__?: string } }) => {
			return plugin?.constructor?.name === 'DefinePlugin';
		});

		expect(definePlugin?.definitions?.__MEDIA_TRACKER_APP_ENV__).toBe('"dev"');
	});

	it('defaults MEDIA_TRACKER_APP_ENV to prod for production mode', () => {
		const webpackConfig = getWebpackConfig('production');
		const definePlugin = webpackConfig.plugins.find((plugin: { definitions?: { __MEDIA_TRACKER_APP_ENV__?: string } }) => {
			return plugin?.constructor?.name === 'DefinePlugin';
		});

		expect(definePlugin?.definitions?.__MEDIA_TRACKER_APP_ENV__).toBe('"prod"');
	});

	it('uses the explicit MEDIA_TRACKER_APP_ENV override when provided', () => {
		getProcessEnv().MEDIA_TRACKER_APP_ENV = 'prod';

		const webpackConfig = getWebpackConfig('development');
		const definePlugin = webpackConfig.plugins.find((plugin: { definitions?: { __MEDIA_TRACKER_APP_ENV__?: string } }) => {
			return plugin?.constructor?.name === 'DefinePlugin';
		});

		expect(definePlugin?.definitions?.__MEDIA_TRACKER_APP_ENV__).toBe('"prod"');
	});

	it('injects MEDIA_TRACKER_BACK_END_BASE_URL when provided', () => {
		getProcessEnv().MEDIA_TRACKER_BACK_END_BASE_URL = 'https://api.example.com';

		const webpackConfig = getWebpackConfig('production');
		const definePlugin = webpackConfig.plugins.find((plugin: { definitions?: { __MEDIA_TRACKER_BACK_END_BASE_URL__?: string } }) => {
			return plugin?.constructor?.name === 'DefinePlugin';
		});

		expect(definePlugin?.definitions?.__MEDIA_TRACKER_BACK_END_BASE_URL__).toBe('"https://api.example.com"');
	});

	it('leaves MEDIA_TRACKER_BACK_END_BASE_URL undefined when no override is provided', () => {
		const webpackConfig = getWebpackConfig('production');
		const definePlugin = webpackConfig.plugins.find((plugin: { definitions?: { __MEDIA_TRACKER_BACK_END_BASE_URL__?: string } }) => {
			return plugin?.constructor?.name === 'DefinePlugin';
		});

		expect(definePlugin?.definitions?.__MEDIA_TRACKER_BACK_END_BASE_URL__).toBe('undefined');
	});
});
