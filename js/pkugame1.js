// Phaser3 PKU test webgame
// game 1

var GAME1_REPEAT = 10;

// main game logic object
var PKUgame1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PKUgame1 ()
    {
        Phaser.Scene.call(this, { key: "pkugame1" });
    },

    preload: function ()
    {

    },
	
    init: function (data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);
    },

    create: function ()
    {
		// background color
		var clr  = (globalvar.practise ? BACKGROUND_BLUE : BACKGROUND_BLACK);
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(clr);
		
		this.square = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "sprites", "game1_plus");
		this.gamestate = -1; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)

		this.key_left  = this.add.sprite(           60, GAME_HEIGHT-60, "sprites", "key_z");
		this.key_right = this.add.sprite(GAME_WIDTH-60, GAME_HEIGHT-60, "sprites", "key_m");

		this.key_left.setAlpha(0.5);
		this.key_right.setAlpha(0.5);

		// !! TESTING !!
		//this.input.keyboard.on('keydown-' + 'Z', this.test123, this);
		//this.input.keyboard.on('keydown-' + 'X', this.test456, this);
		//this.input.keyboard.on('keydown-' + 'C', this.test789, this);
		// !! TESTING !!
		
		this.input.keyboard.on('keydown', this.doGame1KeyDown, this);
		this.input.keyboard.on('keyup',   this.doGame1KeyUp, this);

		// reset repeat counter
		this.game_repeat = 0;
		this.waitevent = null;

		// start game
		this.doStartSquare();

		// !! TESTING !!
		this.debugtxt = this.add.bitmapText(60, 10, "fontwhite", "test123", 24);
    },
	
    update: function (time, delta)
    {
		// test
    },
	
    render: function ()
    {
    },
	
    doStartSquare: function () {
		// reset square
		this.square.setFrame("game1_square") ;
		this.gamestate = -1; // -1=wait
		
		// set random timer
		var msec = Phaser.Math.RND.between(500, 2500); // 0,5 and 2,5 seconds
		this.waitevent = this.time.addEvent({ delay: msec, callback: this.onDisplayPlus, callbackScope: this});
	},
	
    onDisplayPlus: function () {
		// reset square
		this.square.setFrame("game1_plus") ;
		this.gamestate = 0; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		this.starttime = new Date();
	},
	
    doGame1Input: function (key, correct) {
		
		if (correct) {
			// check state -1=wait, 0=ready for input, 1=after input (correct/incorrect)
			if (this.gamestate == -1) {
				// too early
				var msec = Math.floor(this.waitevent.elapsed - this.waitevent.delay);
				console.log("doGame1Input -- TOO EARLY!! msec=" + msec);
				// log result
				this.doGameResult(this.game_repeat, msec);
			} else if (this.gamestate == 0) {
				// measure time
				var endtime = new Date();
				var msec = endtime - this.starttime;
				console.log('doGame1Input -- OK end time msec=' + msec);

				// log result
				this.doGameResult(this.game_repeat, msec);

				// repeat 10 times for each hand or end game
				this.game_repeat++;
				if (this.game_repeat < GAME1_REPEAT) {
					this.doStartSquare();
				} else {
					this.doGameEnd();
				};
			};
		} else {
			// incorrect button, ignore
		};
	},

    doGame1KeyDown: function (evt) {
		// variables
		var spr;
		var ok = false;
		var x;

		// key Z (=left)
		if (evt.keyCode == 90) {
			spr = this.key_left;
			x = 60;
			ok = (globalvar.dominant == CONST_RIGHT && globalvar.game_part == 1); // als rechtshandig en niet-dominante test (deel 1)
			this.doGame1Input(CONST_LEFT, ok);
		};

		// key M (=right)
		if (evt.keyCode == 77) {
			spr = this.key_right;
			x = GAME_WIDTH-60;
			ok = (globalvar.dominant == CONST_RIGHT && globalvar.game_part == 2); // als rechtshandig en dominante test (deel 2)
			this.doGame1Input(CONST_RIGHT, ok);
		};

		// if Z or M pressed
		if (spr) {

			// display key pressed
			if (ok) {
				spr.setAlpha(1.0);
			} else {
				// shake if incorrect key
				var timeline = this.tweens.createTimeline();
				timeline.add({targets: spr, x: x+8, ease: 'Power1', duration: 40});
				timeline.add({targets: spr, x: x-8, ease: 'Power1', duration: 40});
				timeline.add({targets: spr, x: x+4,  ease: 'Power1', duration: 40});
				timeline.add({targets: spr, x: x-4,  ease: 'Power1', duration: 40});
				timeline.add({targets: spr, x: x,    ease: 'Power1', duration: 40});
				timeline.play();
			};
		};
	},
	
    doGame1KeyUp: function (evt, a, b, c) {
		// key Z
		if (evt.keyCode == 90) {
			this.key_left.setAlpha(0.5);
		};
		// key M
		if (evt.keyCode == 77) {
			this.key_right.setAlpha(0.5);
		};
	},
	
    doGameResult: function (idx, msec)
    {
        console.log("doGameResult -- idx=" + idx + " msec=" + msec);
	},

    doGameEnd: function ()
    {
        console.log("gamescene doBack was called!");
		if (globalvar.practise) {
			// keuze oefenen of echte test
			this.scene.start("bumper");
		} else {
			// next part, non-dominant hand to dominant hand
			globalvar.game_part++;
			if (globalvar.game_part <= 2) {
				this.scene.start("tutorial1");
			} else {
				// dominant hand afgerond, eind scherm test 1
				this.scene.start("gameend");
			};
		};
    }

});
