/*
 * This code generates a fresh list of assets. This needs to be run OUTSIDE of Phaser -- such as
 * in webpack/base.js. This is because Phaser's packed form does not have access to
 * the `fs` module for reading and writing files. 
 * 
 * Currently this is set up to be run by `assets.js` in the same directory.
 *
 * Requires a valid options object with the following properties:
 *
 *  assets_path: path to where assets are stored
 *  assets_subdirs: an array of subdirectories to traverse (include "." for the main asset
 * 							directory if you want it to also include that one. not setting this property
 * 							is the same as passing ["."] to it.
 *  asset_file: json file to generate (required if write_file is not false)
 *  asset_extensions: valid extensions for assets (array of strings), e.g. ["png","jpg","jpeg"]
 *	write_file: whether to write to a file or not (optional, default: true) -- if false, will
 *							return the list of assets as an array.
 * 	preserveOrder: if true (default is false), asset files will never re-order assets in a previously
 * 							built file. removed assets will be pruned, and new assets will be appended.
 *
 * Note that this writes ONE file. The resulting JSON will look something like this:
 * {
 *  ".": [
 *  	"FileInMainAssetDirectory",
 *  	"AnotherFileInAssetDirectory",
 *  ],
 *  "AssetSubdirectory": [
 * 		"FileInAssetSubdirectory",
 * 		"AnotherFileInTheSubdirectory"
 *  ]
 * }
 *
 *
 */
const getAssets = (options) => {
	const fs = require("fs");
	const path = require("path");

	var assets = {};

	if (typeof options.asset_subdirs == "undefined") options.asset_subdirs = ["."];
	for (var i in options.asset_subdirs) {
		var subdir = options.asset_subdirs[i];
		assets[subdir] = [];
		if (fs.existsSync(path.join(options.assets_path, subdir))) {
			var files = fs.readdirSync(path.join(options.assets_path, subdir));
			files.forEach((file) => {
				if (options.asset_extensions.indexOf(path.extname(file).toLowerCase().replaceAll(".", "")) > -1) {
					assets[subdir].push(file.substr(0, file.length - path.extname(file).length));
				}
			});
		}
	}

	var write_file = typeof options.write_file == "undefined" ? true : options.write_file;
	if (write_file) {
		if (options.preserveOrder) {
			//if file exists, read and parse it
			if (fs.existsSync(options.asset_file)) {
				var existingFile = fs.readFileSync(options.asset_file);
				try {
					var existingJSON = JSON.parse(existingFile);
				} catch (err) {
					var existingJSON = false;
				}
			}
			if (existingJSON) {
				var _assets = {};
				for (var subdir in assets) {
					if (existingJSON[subdir]) {
						_assets[subdir] = [];
						//first use existing, and add in order if in `assets`
						for (var i in existingJSON[subdir]) {
							if (assets[subdir].includes(existingJSON[subdir][i])) _assets[subdir].push(existingJSON[subdir][i]);
						}
						//then do a final pass over `assets` to find any new ones
						for (var i in assets[subdir]) {
							if (!_assets[subdir].includes(assets[subdir][i])) _assets[subdir].push(assets[subdir][i]);
						}
					} else {
						//if subdir is new, just accept it
						_assets[subdir] = assets[subdir];
					}
				}
				assets = _assets;
			}
		}
		fs.writeFileSync(options.asset_file, JSON.stringify(assets));
		console.log(options.asset_file + " written");
	}
	return assets;
};
module.exports = { getAssets };
