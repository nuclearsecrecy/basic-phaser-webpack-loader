/**
 * This file is a settings file for dynamically loading assets from directories.
 * Basically, using the `getAssets` class, you can tell your game where to 
 * search for assets of different types, and to load them into specific
 * JSON files. Then the Preloader will load them.
 * 
 * This saves the time of having to manually enter in assets into a JSON
 * file or a `preload` code block. 
 * 
 * Note that `getAssets` is smart enough that it will not generate a new JSON
 * file of assets unless there are changes. And it will simply append newly-found
 * assets to existing JSON lists, so if for some reason the order of the asset
 * file matters, it will be preserved.
 * 
 * 
 */

const { getAssets } = require("./lib/getAssets.js");

const path = require("path");

//path to public assets
var public_path = path.join(__dirname, "..", "public");
var assets_path = path.join(public_path, "assets");
var data_path = path.join(public_path, "assets", "data");

//images
getAssets({
	assets_path: assets_path, //path to where assets are stored
	asset_subdirs: ["images"], //subdirectories to also traverse
	asset_file: path.join(data_path, "images.json"), //json file to generate
	asset_extensions: ["png"], //valid extensions for assets
});

//sprites
getAssets({
	assets_path: assets_path, //path to where assets are stored
	asset_subdirs: ["sprites"], //subdirectories to also traverse
	asset_file: path.join(data_path, "sprites.json"), //json file to generate
	asset_extensions: ["png"], //valid extensions for assets
});
