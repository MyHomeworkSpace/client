var { DefinePlugin } = require("webpack");

var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var WebpackBar = require('webpackbar');

var path = require('path');

var mode = (process.env.NODE_ENV === "production" ? "production" : "development");
var isProduction = (mode == "production");

var plugins = [
	new WebpackBar(),

	new DefinePlugin({
		PRODUCTION: JSON.stringify(isProduction),
	}),

	new CleanWebpackPlugin(),

	new MiniCssExtractPlugin({
		filename: "bundle.css"
	}),

	new CopyWebpackPlugin([
		{ from: "robots.txt", to: "" },
		{ from: "public/css", to: "css" },
		{ from: "public/fonts", to: "fonts" },
		{ from: "public/img", to: "img" },
		{ from: "public/js", to: "js" }
	]),

	new HtmlWebpackPlugin({
		template: "base.ejs",
		inject: false,
		title: "MyHomeworkSpace"
	})
];

if (isProduction) {
	plugins.push(new OptimizeCssAssetsPlugin({}));
}

module.exports = {
	entry: './app/main.js',

	devtool: 'source-map',

	devServer: {
		contentBase: "./dist",
		disableHostCheck: true, // TODO: this should not be needed
		historyApiFallback: true,
		port: 9001,
		public: "app.myhomework.invalid:80"
	},

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		library: "MHSBridge"
	},

	module: {
		rules: [
			{
				test: /.(js|jsx)$/,
				loaders: 'buble-loader',
				include: path.join(__dirname, 'app'),
				options: {
					jsx: "h",
					objectAssign: "Object.assign"
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
	},

	stats: 'errors-warnings'
};