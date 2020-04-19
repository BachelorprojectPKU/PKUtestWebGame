// Phaser3 PKU test webgame
// preloader and loading bar

var ScoreProgress;

var PKUTEST_VERSION = "v0.1";

var GAME_WIDTH = 960;
var GAME_HEIGHT = 640;

var GAME_WIDTH_CENTER = 480;
var GAME_HEIGHT_CENTER = 320;

// helper function
createRectangle = function(scene, x, y, w, h, color, alpha) {
	var rect = scene.add.graphics();

    rect.fillStyle(color, alpha);

    rect.fillRect(x, y, w, h);

	return rect;
};

var Preloader = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function Preloader ()
	{
		// note: the pack:{files[]} acts like a pre-preloader
		// this eliminates the need for an extra "boot" scene just to preload the loadingbar images
		Phaser.Scene.call(this, {
			key: 'preloader',
			pack: {
				files: [
					{ type: 'image', key: 'loadingbar_bg', url: 'res/img/loadingbar_bg.png' },
					{ type: 'image', key: 'loadingbar_fill', url: 'res/img/loadingbar_fill.png' }
				]
			}
		});
	},
	
	setPreloadSprite: function (sprite)
	{
		this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };

		//sprite.crop(this.preloadSprite.rect);
		sprite.visible = true;

		// set callback for loading progress updates
		this.load.on('progress', this.onProgress, this );
	},
	
	onProgress: function (value) {

		if (this.preloadSprite)
		{
			//debugger;
			// calculate width based on value=0.0 .. 1.0
			var w = Math.floor(this.preloadSprite.width * value);
			
			// sprite.frame.width cannot be zero
			//w = (w <= 0 ? 1 : w);
			
			// set width of sprite			
			this.preloadSprite.sprite.frame.width    = (w <= 0 ? 1 : w);
			this.preloadSprite.sprite.frame.cutWidth = w;

			// update screen
			this.preloadSprite.sprite.frame.updateUVs();
		}
	},

	LoadScoreProgress: function () {

		// load from localstorage
		var tr = window.localStorage.getItem("pkutest_scores");

		// error checking, localstorage might not exist yet at first time start up
		try {
			ScoreProgress = JSON.parse(tr);
		} catch (e) {
			ScoreProgress = []; //error in the above string (in this case,yes)!
		};
		// error checking just to be sure, if localstorage contains something else then a JSON array (hackers?)
		if (Object.prototype.toString.call(ScoreProgress) !== "[object Array]") {
			ScoreProgress = [];
		};

		// initialise progress array
		// TODO: initialise object
		ScoreProgress = {"score1": 0};
	},

	preload: function ()
	{
		// setup the loading bar
		// note: images are available during preload because of the pack-property in the constructor
		this.loadingbar_bg   = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "loadingbar_bg");
		this.loadingbar_fill = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "loadingbar_fill");
		this.setPreloadSprite(this.loadingbar_fill);

		// now load images, audio etc.
		// sprites, note: see free sprite atlas creation tool here https://www.leshylabs.com/apps/sstool/
		this.load.atlas('sprites', 'res/img/sprites.png', 'res/img/sprites.json');

		// sprite sheet, rectangle frames
		this.load.spritesheet('faces1', 'res/img/photos_happy.png',  { frameWidth: 212, frameHeight: 212, endFrame: 8 });
		this.load.spritesheet('faces2', 'res/img/photos_sad.png',    { frameWidth: 212, frameHeight: 212, endFrame: 8 });
		this.load.spritesheet('faces3', 'res/img/photos_angry.png',  { frameWidth: 212, frameHeight: 212, endFrame: 8 });
		this.load.spritesheet('faces4', 'res/img/photos_scared.png', { frameWidth: 212, frameHeight: 212, endFrame: 8 });

		// font
		this.load.bitmapFont('fontwhite', 'res/img/fontwhite.png', 'res/img/fontwhite.xml');
		
		// sound effects
		//this.load.audio('sfx_button',  ['snd/gui_button.mp3',  'snd/gui_button.ogg']);
		//this.load.audio('sfx_forward', ['snd/gui_forward.mp3', 'snd/gui_forward.ogg']);

		// load progess
		this.LoadScoreProgress();
	},

	create: function ()
	{

		// dispose loader bar images
		this.loadingbar_bg.destroy();
		this.loadingbar_fill.destroy();
		this.preloadSprite = null;


		if (this.sys.game.device.os.desktop){
			// start actual game
			this.scene.start('mainmenu');
			//this.scene.start('tutorial1');
			//this.scene.start('pkugame1');
			//this.scene.start('tutorial2');
			//this.scene.start('pkugame2');
			//this.scene.start('tutorial3');
			//this.scene.start('pkugame3');
			//this.scene.start('tutorial4');
			//this.scene.start('pkugame4');
			//this.scene.start('bumper');
			//this.scene.start('gameend');
		} else {
			// cannot play without keyboard
			this.scene.start('cannotplay');
		};
	}
});
