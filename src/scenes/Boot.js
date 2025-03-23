/**
 * Boot is always the first scene that loads for the game.
 * It should be used to setup very basic thing that need to run
 * even before the Preloader, like telling the Preloader what
 * the path to the data files to load will be.
 */
export default class Boot extends Phaser.Scene {
	constructor() {
		super("Boot");
	}

	// Runs first. 
	init() {
		console.log(this.scene.key+":init");
		// Could be used for things like initializing universal functions or
		// classes. If you do, attach them to `this.game` if you want them to 
		// be accessible to other scenes and not be destroyed when this scene is done.
	}

	// Runs before create.
	preload() {
		console.log(this.scene.key+":preload");

		//before anything else, load the path to data files!
		this.load.setPath("assets");
		this.load.json("data_files", "data_files.json");
		
	}
	// Runs after preload.
	create() {
		console.log(this.scene.key+":create");
		// Start the Preloader.
		this.scene.start("Preloader", this);
	}

}