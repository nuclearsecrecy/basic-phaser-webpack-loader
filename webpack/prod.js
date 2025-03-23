/**
 * This is the production settings for exporting the game files. It will
 * by default output a complete copy of the game into the folder `dist`.
 * This will include a copy of all assets as well as all generated
 * code.
 * 
 * It loads the settings from `base.js` and then appends/modifies them. So
 * most basic settings can be changed in `base.js`.
 */

const base = require("./base.js");
const fs = require("fs");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

const dist_path = path.join(__dirname, "..", "dist"); //output path

//copy relevant folders to dist
require("./lib/copyFiles.js")({
	public: base.devServer.static.directory,
	output: dist_path,
	exclude: [], //never export files with these names
	exclude_ext: ["psd","aseprite","DS_Store"], //never export files with these extensions
});

module.exports = {
	...base,
	...{
		mode: "production",
		devtool: false,
		performance: {
			maxEntrypointSize: 2000000,
			maxAssetSize: 2000000,
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						output: {
							comments: false,
						},
					},
				}),
			],
		},
		plugins: [
			...base.plugins,
			{
				apply: (compiler) => {
					compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
						// Any code you want to run AFTER the export is complete
						// should go here. 
						console.log("Done compiling");
					});
				},
			},
		],
	},
};
