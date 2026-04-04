const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (_env, argv = {}) => {
	const appEnvironment = process.env.MEDIA_TRACKER_APP_ENV || (argv.mode === 'production' ? 'prod' : 'dev');

	return {
		entry: './index.tsx',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'bundle.[contenthash].js',
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
					test: /\.(png|jpg|jpeg|gif|svg)$/i,
					type: 'asset/resource'
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				__MEDIA_TRACKER_APP_ENV__: JSON.stringify(appEnvironment)
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
