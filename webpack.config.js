var path = require('path');

module.exports = {
	entry: './app/main.js',

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: "/dist/",
		library: "MHSBridge"
	},

	module: {
		rules: [
			{
				test: /.js$/,
				loaders: 'buble-loader',
				include: path.join(__dirname, 'app'),
				query: {
					jsx: "h"
				}
			},
			{test: /\.(styl)$/, use: [ 'style-loader', 'css-loader', 'stylus-loader' ]},
			{test: /\.(css)$/, use: 'css-loader'}
		]
	},

	plugins: [],

	resolve: {
		modules: [
			path.resolve("./app"),
			path.resolve("./node_modules")
		]
	}
};