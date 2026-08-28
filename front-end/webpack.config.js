const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * The size under which a raster image is inlined as a data URI instead of emitted as its own file.
 * Every icon in the project is comfortably below it and every real photograph is comfortably above it,
 * so an image that grows past this stops being inlined on its own.
 */
const RASTER_INLINE_MAX_BYTES = 4 * 1024;

/**
 * Turns an SVG into an inline data URI, so that icons are part of the bundle instead of separate requests.
 * The encoding is URI-escaped rather than base64: it stays text, which compresses far better, and it escapes
 * everything that would terminate an unquoted CSS url(...), which is how the own-platform mask icons are used.
 * @param {Buffer} content the raw file contents
 * @returns {string} the data URI
 */
const svgToDataUri = (content) => {
	const encoded = encodeURIComponent(content.toString())
		.replace(/'/g, '%27')
		.replace(/"/g, '%22')
		.replace(/\(/g, '%28')
		.replace(/\)/g, '%29');

	return `data:image/svg+xml,${encoded}`;
};

module.exports = (_env, argv = {}) => {
	const appEnvironment = process.env.MEDIA_TRACKER_APP_ENV || (argv.mode === 'production' ? 'prod' : 'dev');
	const backEndBaseUrl = process.env.MEDIA_TRACKER_BACK_END_BASE_URL;

	return {
		entry: './index.tsx',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'assets/bundle.[contenthash].js',
			assetModuleFilename: 'assets/[contenthash][ext]',
			publicPath: '/',
			clean: true
		},
		resolve: {
			extensions: [ '.tsx', '.ts', '.js' ],
			alias: {
				app: path.resolve(__dirname, 'app')
			}
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: {
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.webpack.json'
						}
					},
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: [ 'style-loader', 'css-loader' ]
				},
				{
					test: /\.svg$/i,
					type: 'asset/inline',
					generator: {
						dataUrl: svgToDataUri
					}
				},
				{
					test: /\.(png|jpg|jpeg|gif)$/i,
					type: 'asset',
					parser: {
						dataUrlCondition: {
							maxSize: RASTER_INLINE_MAX_BYTES
						}
					}
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				__MEDIA_TRACKER_APP_ENV__: JSON.stringify(appEnvironment),
				__MEDIA_TRACKER_BACK_END_BASE_URL__: typeof backEndBaseUrl === 'string' ? JSON.stringify(backEndBaseUrl) : 'undefined'
			}),
			new HtmlWebpackPlugin({
				template: 'public/index.html',
				favicon: 'app/resources/images/ic_app_logo.png'
			})
		],
		devServer: {
			static: {
				directory: path.join(__dirname, 'public')
			},
			historyApiFallback: true,
			port: 5173,
			open: false
		}
	};
};
