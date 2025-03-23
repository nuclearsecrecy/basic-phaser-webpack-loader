# Basic Phaser Webpack Loader template

This is a template for setting up a game in the [Phaser](https://phaser.io/) coding environment. Unlike the examples on the Phaser site, it assumes a few things:

* That your game is going to eventually contain many [Scenes](https://docs.phaser.io/api-documentation/class/scene).
* That you would like to load the game in a [Webpack](https://webpack.js.org/) environment for both development and production output.
* That you will eventually have a lot of assets (e.g. images, sprites, etc.) that will need to be loaded, and you will not want to keep manual lists of them every time you want to add a new one.
* That you would like your game to preload all of your assets automatically each time you launch it and have a little progress bar while it does so.
* That when you are ready to export your game so that it does not require a Node environment to play, you will want all of the assets and game files bundled into a single directory for easy distribution.

These assumptions may not all be true in your case, but it is relative easy to disable these things within this template. It is designed to be just-simple-enough to accomplish all of the above. 

I developed this template because I found that it was very annoying to start every Phaser project from scratch and have to cannibalize existing code to set up a basic Webpack environment with a Preloader. And because I hate keeping track of assets manually -- I would prefer to just drop my images in a folder and have the game understand they are there.

Every time you want the game to update its internal list of assets, you must stop and re-start the Webpack environment. This is because the asset lists have to be created before Webpack loads; they cannot modify the files "on the fly" the way that Webpack normally can with hot updates. (There probably is a way to make Webpack do that, but as it is a little time-consuming to check and regenerate assets for large projects, it probably is better to just keep it as a manual thing.)

# Usage

You are welcome to fork, clone, or download this repo and use it as a base for your own works. I do not claim any copyright over any of it. 

After downloading or cloning it, make sure it has all of its Node dependences loaded:

```
npm i
```

Then you should be able to load the live Webpack environment like so:

```
npm start
```

Once started it, it should open a browser, do a very quick loading screen (as there is currently only one asset), and then show a test image. 

When you want to compile your game for distribution, run the following command:

```
npm run build
```

Doing so will (by default) put a copy of the game and its assets in the folder `./dist/`. It takes a minute or so to compile the game assets, usually. If the `dist` folder does not exist, it will **not** create it (to avoid causing any havoc).

# Loading assets

This is set up so that there is a directory for game code called `src`, and a higher-level directory called `public` for all game assets. When you run WebPack, `public` will be the base directory for `localhost:8080/`. 

The way the auto-loader works is that upon initializing, WebPack will run `/webpack/assets.js`. This is a little bit of code that checks if you have added (or removed) files from the `public/assets` directories and updates `JSON` files in the `public/assets/data` directory accordingly. The `Preloader.js` scene will use these files to detect what assets to load. 

By default, it is set up to load only two types of assets: images and sprites. Images are single-framed textures (e.g., `PNG` files) that have been put into the directory `public/assets/images`. Sprites are `PNG` and `JSON` files exported by [Aseprite](https://www.aseprite.org/) and meant to be used for animated sprites.

To set up a new directory of assets, or different kinds of assets, you must:

1. Edit `webpack/assets.js` to load the correct directory and file extensions;
2. Edit `public/data_files.json` to tell it what `JSON` files to store the asset references in (e.g., the `"images": "images.json"` part is telling it that "assets loaded as 'images' are found in 'images.json').
3. Edit `src/Preloader.js` to load it with the correct [loader](https://docs.phaser.io/phaser/concepts/loader) type (e.g., `this.load.image` or `this.load.audio`).

**NOTE:** `assets.js` is only run when you run `npm start` or `npm run build` — it does not get "re-run" every time Webpack does a "hot" update or if you just add a new file into the assets directory. So when you add new assets, you need to stop Node (`control+C` in the terminal) and then run `npm start` again to re-load. (It would be nice if this wasn't necessary, but I think it is required.)

# Directories and files

This is a basic overview of the directories and files and their purpose in this template.

- `public`: This is the directory that Webpack will use as the base directory for your game. So this is where all external files that need to be accessed by the game itself (that is, not part of its code) will be put.
- - `assets`: This is a subdirectory that contains assets.
- - - `data_files.json`: This is a JSON file that tells the Preloader where other JSON files with lists of assets are kept. This needs to be updated if you have differnet kinds of assets that you want Preloader to find. By defualt, it will point the Preloader to the directory `data`, which contains JSON files. It also will tell it which JSON files to load. So `public/assets/data/images.json` would be a list of static image files, and `public/assets/data/sprites.json` would be a list of (Aseprite-generated) sprites. These JSON files are generated automatically by `assets.js` when Webpack is started. See more on that below.
- - - `images`, `sprites`, etc.: Directories that contain actual assets, sorted by at least type, but also can be sorted for your convenience. So you could create directories for `map`, `faces`, `cars`, etc., if it made your life easier, but each directory should only contain one type of asset (e.g., static images, sprites, sounds). 

- `src`: The directory that contains all of the Phaser-specific code to be compiled.
- - `index.js`: The initializing script for the Phaser game, which includes the basic game configuration. This is where you set the resolution of the game, and load all of the Scenes in the game.
- - `scenes`: The directory that contains all of the Scene class files for the game. When you create a new Scene, it must be manually added to the list of Scenes in `index.js`.
- - - `Boot.js`: The absolute first Scene that is run, and should only be used for very low-level operations. This sets the path to `data_files.json` at the moment.
- - - `Preloader.js`: This Scene will load all of the assets for the game and show a very simple progress bar while doing so. It will then go to whatever scene is set as `this.nextScene` (by default, this is set to "Start").
- - - `Start.js`: The first Scene that is shown after the Preloader has finished. Right now this is just a little demo showing how to access an Image and a Sprite that the Preloader has loaded. Replace as necessary; just make sure to update `this.nextScene` in `Preloader.js`. 

- `webpack`: This directory contains various settings and helper functions for Webpack, which is the server that loads or compiles the game.
- - `assets.js`: This is a file that specifies where assets are kept, and checks if the assets for a game need to be updated. See the section above on assets for more information.
- - `base.js`: The settings for the Webpack configuration that is run when you run `npm start`. It runs `assets.js` and loads a "hot" update server that will automatically re-start Webpack whenever you update the game code.
- - `prod.js`: The settings for the Webpack configuration that is run when you run `npm build`. It runs `assets.js` and also copies all of the assets and output code to `dist`. It does not run a server: it just creates a copy of your entire "compiled" game in `dist`. 
- - `lib`: A directory of helper scripts for the asset system:
- - - `copyFiles.js`: This is a script that is used by `prod.js` to copy all of the asset files (excluding certain filetypes that are almost certainly unlikely to be ones you want copied) to `dist`. 
- - - `getAssets.js`: This is a script that is used by `assets.js` to actually check if there are assets that need updating and to make asset `JSON` files. 

- `index.html`: The `HTML` file which will host the `canvas` element of the final game. It has some very minimal styling. Note that you may want to change its `max-width` and `max-height` settings for the `canvas` element, if things don't look good to you.

- `package.json`: The Node package file that includes dependencies and so on. 

- `README.md`: This file!

# Notes

I am not the world's most knowledgable about Webpack so it is entirely possible that the settings I've used involve unnecessary packages, etc. 

It would be WONDERFUL if it was possible to cause the Webpack hot reloader to detect when NEW files are added to the assets directories, and then trigger a rebuild of the assets files. However I cannot figure out how this would work, as it does not appear to detect new files being added under any settings I can find. 

I have nothing to do with either Phaser or Webpack. Use at your own risk, no warranties given, etc. I do not claim copyright on anything here.