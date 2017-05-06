var path = require('path');

module.exports = {
	entry: './app/main.js',

	output: {
		filename: 'bundle.js',
		path: (process.env.NODE_ENV === 'production' ? path.resolve(__dirname, 'www', 'js') : path.resolve(__dirname, 'public', 'js')),
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