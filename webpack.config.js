var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var path = require('path');

var mode = (process.env.NODE_ENV === "production" ? "production" : "development");
var isProduction = (mode == "production");

var plugins = [
	new MiniCssExtractPlugin({
		filename: "../css/bundle.css"
	})
];

if (isProduction) {
	plugins.push(new OptimizeCssAssetsPlugin({}));
}

module.exports = {
	entry: './app/main.js',

	devtool: 'source-map',

	output: {
		filename: 'bundle.js',
		path: (isProduction ? path.resolve(__dirname, 'www', 'js') : path.resolve(__dirname, 'public', 'js')),
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
				test: /\.(styl)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isProduction
						},
					},
					"css-loader",
					"stylus-loader"
				]
			},
			{ test: /\.(css)$/, use: 'css-loader' }
		]
	},

	plugins: plugins,

	resolve: {
		modules: [
			path.resolve("./app"),
			path.resolve("./node_modules")
		]
	}
};