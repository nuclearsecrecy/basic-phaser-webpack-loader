import Phaser from "phaser";

// Array for holding references to scenes.
let scenes = [];

// Initialize each scene, then add it to `scenes`:

// Boot always runs first, and is for low-level settings.
import Boot from "./scenes/Boot.js"; 
scenes.push(Boot);

// Preloader runs after Boot, and loads necessary assets.
import Preloader from "./scenes/Preloader.js"; 
scenes.push(Preloader);

// Start is just a dummy scene to show that the game has loaded.
import Start from "./scenes/Start.js"; 
scenes.push(Start);

// Repeat the above for any other scenes you want to add to the game.
// If you want to avoid doing it individually, you could always do: 
// let scenes = [Boot, Preloader, Start];
// I just find it easier to do this in the same place as the `import` statements
// rather than down below, especially once you start to have a lot of Scenes to
// keep track of.

// Initialize the actual game object. 
let game = new Phaser.Game({

	// Internal resolution of the Phaser game (as opposed to its CANVAS element's size)
	width: 640, 
	height: 360, 

	// The Phaser renderer to use. Phaser.AUTO will use WebGL if possible. Phaser.CANVAS will use Canvas rendering mode.
	type: Phaser.AUTO,

	// The id of the DIV in index.html into which to insert the CANVAS element
	parent: "phaser", //div in index.html

	// The Scale Manager configuration. FIT will automatically scale the game to fit the CANVAS element while preserving the aspect ratio.
	scale: {
		mode: Phaser.Scale.FIT 
	},

	// The settings below are good for pixel art games. 
	antialias: false, // Tells WebGL NOT to add antialiasing when scaling sprites.
	roundPixels: true, // Draws texture-based Game Objects to whole-integer positions. Does not always work in my experience. But worth a try.
	pixelArt: true, // Is the same as setting antialias to false and roundPixels to true. So technically redundant.

	// The array of Scenes added to the game. The `scenes` variable is populated above.
	scene: scenes, 
});

