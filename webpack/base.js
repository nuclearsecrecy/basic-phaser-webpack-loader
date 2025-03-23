/**
 * This is the basic webpack setup for a live test environment.
 * It will setup a webpack live server which runs out of the 
 * directory "../public/". All game assets that need to be loaded
 * from the compiled script (e.g., images) need to be put in there.
 * It runs `loadAssets.js` as well, which regenerates asset listings
 * for any files put into the `public` assets directories. See that
 * file to specify different asset categories.
 * 
 */

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

//regenerate the asset json files each time webpack is run
require("./assets.js");
module.exports = {
	mode: "development",
	devtool: "eval-source-map",
	output: {
		// Will be the name of the JS file of the Phaser game that is compiled.
		// Will not actually create this file in development mode, but will
		// create it in production mode.
		filename: "game.min.js",
	},
	devServer: {
		// Specifies the location of the assets directory
		static: {
			directory: path.join(__dirname, "..", "public"),
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: [/\.vert$/, /\.frag$/],
				use: "raw-loader",
			},
			{
				test: /\.(gif|png|jpe?g|svg|xml)$/i,
				use: "file-loader",
			},
		],
	},
	resolve: {
		fallback: {
			path: require.resolve("path-browserify"),
			os: false,
			crypto: false,
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
		})
	],
};