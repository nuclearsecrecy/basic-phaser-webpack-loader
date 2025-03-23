/**
 * Preloader makes sure that all external assets (data files, graphics,
 * sounds, etc.) are loaded before the game really starts. 
 * Put the name of the next scene to go to in `init`.
 */
export default class Preloader extends Phaser.Scene {
	constructor() {
		super("Preloader");
	}

	// Runs first. 
	init() {
		console.log(this.scene.key+":init");
		
		// The scene to load after loading is complete.
		this.nextScene = "Start";
	}

	// Runs before create.
	preload() {
		console.log(this.scene.key+":preload");

		//the data_files file should have been loaded in Boot
		this.data_files = this.cache.json.get("data_files");

		this.load.setPath(this.data_files.datapath);

		//load all of the JSON files
		for (const key of Object.keys(this.data_files.json)) {
			this.load.json(key, this.data_files.json[key]);
		}
	}

	// Runs after preload.
	create () {
		console.log(this.scene.key+":create");

		// This is where the size of the game is stored
		this.width = this.sys.game.scale.baseSize.width;
		this.height = this.sys.game.scale.baseSize.height;

		// Create a simple progress bar
		this.bar_length = this.width/2;
		this.bar_height = this.height/20;
		this.bar_frame = this.add.rectangle(this.width/2-5,this.height/2-5, this.bar_length+10,this.bar_height+10,undefined,0).setStrokeStyle(2,0xffffff);
		this.bar = this.add.rectangle(this.bar_frame.x-this.bar_length/2,this.bar_frame.y,this.bar_length*0,this.bar_height,0xffffff).setOrigin(0,0.5);

		// Now we are setting up all of the loaders. We do this by looking up the
		// list of files in each of the relevant JSON files, and then adding them
		// to the loader with this.load.setPath and then the appropriate loader
		// function (e.g., this.load.image). At the end, we will tell the loader to start
		// loading the assets.

		// set up the loader to load "images" 
		const images = this.cache.json.get("images");
		for (const imageDir of Object.keys(images)) {
			this.load.setPath(this.data_files.assets + "/" + imageDir);
			for (const img in images[imageDir]) {
				this.load.image(images[imageDir][img], images[imageDir][img] + ".png?" + this.game.version);
			}
		}

		// set up the loader to load "sprites"
		// this is designed for aseprite animation sprites (png + json files).
		const sprites = this.cache.json.get("sprites");
		this.load.setPath(this.data_files.assets + "sprites");
		for (const spriteName of sprites.sprites) {
			this.load.aseprite(spriteName, spriteName + ".png?v=" + this.game.version, spriteName + ".json?v=" + this.game.version);
		}

		// if you set up other categories, you would need to use the appropriate loaders
		// for them here. 

		//create event to run whenever an asset has been loaded
		this.load.on("progress",function(progress) {
			// Note that when we are in a `function`, "this" means the *loader*
			// and not the Scene.

			// So we have to use this.scene to reference the original scene
			// that we referenced with "this" before. Phew!
			
			//update the progress bar
			this.scene.bar.width = this.scene.bar_length*progress;

		})

		//create an event to run when all assets loaded
		this.load.on('complete', function () {
			// Fade out the progress bar
			this.scene.tweens.add({
				targets: [this.scene.bar_frame, this.scene.bar],
				ease: "Linear",
				alpha: 0,
				duration: 200,
				onComplete: ()=> {
					// Load the next scene
					this.scene.scene.start(this.scene.nextScene) 
				}
			})
		})

		// Having told it what to do, we can now start the loader!
		this.load.start();

	}

}