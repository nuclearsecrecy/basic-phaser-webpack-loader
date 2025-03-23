/**
 * This is the first "real" game scene in this setup. Obviously
 * it doesn't have to be called Start. 
 */
export default class Start extends Phaser.Scene {
	constructor() {
		// Initializes the class as a Phaser.Scene.
		super("Start");
	}

	// `init` always runs first. 
	init() {
		console.log(this.scene.key+":init");
	}

	// `preload` runs after `init` and before `create`.
	preload() {
		console.log(this.scene.key+":preload");
	}

	// `create` runs after `preload`.
	create() {
		console.log(this.scene.key+":create");

		// This is where the size of the game (in its internal, Phaser coordinates) 
		// is stored. I find it useful to always attach this to the `scene` itself.
		this.width = this.sys.game.scale.baseSize.width;
		this.height = this.sys.game.scale.baseSize.height;

		// This is just a little demo showing the loading of an image (phaser.png) and
		// animating it. Note that the image has been already loaded by the `Preloader`
		// scene, if everything has gone right.
		this.img = this.add.image(0,0,"phaser").setOrigin(0).setDepth(1);
		this.img.setX(Phaser.Math.Between(0,this.width-this.img.width));
		this.img.setY(Phaser.Math.Between(0,this.height-this.img.height));
		this.img.vx = Phaser.Math.FloatBetween(-1,1);
		this.img.vy = Phaser.Math.FloatBetween(-1,1);
		if(Math.round(this.img.vx)==0) this.img.vx = 1;
		if(Math.round(this.img.vy)==0) this.img.vy = 1;

		// Load up an array of "star" sprites, and have them play at random
		// coordinates and scales. Note that the "star" sprite was created
		// by Aseprite, which is why we have to use `createFromAseprite`.
		const stars = [];
		for (let i = 0; i < 16; i++) {
			stars[i] = this.add.sprite(Phaser.Math.Between(0,this.width),Phaser.Math.Between(0,this.height),"star").setDepth(0);
			stars[i].anims.createFromAseprite("star");
			stars[i].setScale(Phaser.Math.Between(1,3));
			stars[i].play({ 
				key: "twinkle", // "frame" of animation to play
				repeat: -1, // repeat endlessly
				delay: Math.random() * 8000 // stretch out when they begin to play over an interval of 8 seconds
			 })
			 stars[i].on("animationrepeat",function() {
				// Every time the animation loops, it relocates the sprite
				this.setScale(Phaser.Math.Between(1,3));
				this.setX(Phaser.Math.Between(0,this.scene.width));
				this.setY(Phaser.Math.Between(0,this.scene.height));
			 })
		}

		// Create a looping timer -- we could use an `update()` method for this,
		// if we wanted the delay to always be equal to the framerate. I personally
		// like decoupling it from the framerate, but your mileage may vary. 
		this.time.addEvent({
			delay: 10, //milliseconds
			loop: true,
			callback:()=>{
				// Just bounces the image around the screen by using the 
				// vectors (vx,vy) and the position. Flips the vectors
				// if it exceeds bounds. It is not precise.
				this.img.x = Math.round(this.img.x+this.img.vx);
				this.img.y = Math.round(this.img.y+this.img.vy);
				if(this.img.x<=0 || this.img.x+this.img.width>=this.width) this.img.vx*=-1;
				if(this.img.y<=0 || this.img.y+this.img.height>=this.height) this.img.vy*=-1;
			}
		})
	}

	// `update` runs on every frame update the game. 
	update() {

	}

}