var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
	entry: './app/main.js',

	devtool: 'source-map',

	output: {
		filename: 'bundle.js',
		path: (process.env.NODE_ENV === 'production' ? path.resolve(__dirname, 'www', 'js') : path.resolve(__dirname, 'public', 'js')),
		library: "MHSBridge"
	},

	module: {
		rules: [
			{
				test: /.(js|jsx)$/,
				loaders: 'buble-loader',
				include: path.join(__dirname, 'app'),
				query: {
					jsx: "h"
				}
			},
			{
				test: /\.(styl)$/, use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'stylus-loader']
				})
			},
			{ test: /\.(css)$/, use: 'css-loader' }
		]
	},

	plugins: [
		new ExtractTextPlugin("../css/bundle.css")
	],

	resolve: {
		modules: [
			path.resolve("./app"),
			path.resolve("./node_modules")
		]
	}
};