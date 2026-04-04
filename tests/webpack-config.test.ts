const webpackConfig = require('../webpack.config');

describe('webpack config', () => {
	it('injects the app favicon into the generated html', () => {
		const htmlWebpackPlugin = webpackConfig.plugins.find((plugin: { userOptions?: { template?: string; favicon?: string } }) => {
			return plugin?.userOptions?.template === 'public/index.html';
		});

		expect(htmlWebpackPlugin?.userOptions?.favicon).toBe('app/resources/images/ic_app_logo.png');
	});
});
