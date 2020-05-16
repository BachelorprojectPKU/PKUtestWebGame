// Phaser3 PKU test webgame
// game 1

var GAME1_MIN_WAIT =  500; // 0.5 sec
var GAME1_MAX_WAIT = 2500; // 2.5 sec

// main game logic object
var PKUgame1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PKUgame1()
    {
        Phaser.Scene.call(this, { key: "pkugame1" });
    },

    preload: function()
    {

    },
	
    init: function(data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);
		
		globalvar.game = 1;

		// !! TESTING !!
		//globalvar.game_part = 1;
		//globalvar.practise = false;
    },

    create: function()
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
		
		var b_left = (2-globalvar.dominant == globalvar.game_part); // als rechtshandig en niet-dominante test (deel 1)
		var left_icon  = this.add.sprite(           60, GAME_HEIGHT-130, "sprites", (b_left ? "icon_yes" : "icon_no") );
		var right_icon = this.add.sprite(GAME_WIDTH-60, GAME_HEIGHT-130, "sprites", (b_left ? "icon_no" : "icon_yes") );
		left_icon.setAlpha(0.5);
		right_icon.setAlpha(0.5);

		// !! TESTING !!
		//this.input.keyboard.on('keydown-' + 'Z', this.test123, this);
		//this.input.keyboard.on('keydown-' + 'X', this.test456, this);
		//this.input.keyboard.on('keydown-' + 'C', this.test789, this);
		// !! TESTING !!
		
		this.input.keyboard.on('keydown', this.doGame1KeyDown, this);
		this.input.keyboard.on('keyup',   this.doGame1KeyUp, this);

		// reset repeat counter
		this.game_repeat = 0;
		this.repeat_max = (globalvar.practise ? GAME1_REPEAT_PRACTISE : GAME1_REPEAT);
		
		// game results and times
		this._results = [];
		this._times  = [];

		this.waitevent = null;

		// !! TESTING !!
		this.debugtxt = this.add.bitmapText(60, 10, "fontwhite", "", 24);
		
		// start game
		this.doStartPlus();
    },
	
    update: function(time, delta)
    {
		// test
    },
	
    render: function()
    {
    },
	
    doStartPlus: function() {
		// reset to plus
		this.square.setFrame("game1_plus") ;
		this.gamestate = -1; // -1=wait
		
		// set random timer
		var msec = Phaser.Math.RND.between(GAME1_MIN_WAIT, GAME1_MAX_WAIT);
		this.waitevent = this.time.addEvent({ delay: msec, callback: this.onDisplaySquare, callbackScope: this});
	},
	
    onDisplaySquare: function() {
		// show square
		this.square.setFrame("game1_square") ;
		this.gamestate = 0; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)

		this.starttime = new Date();
		this._timeout = this.time.delayedCall(TIMEOUT_DELAY, this.doTimeout, null, this);
		
		this.debugTextGame1("");
	},
	
    doGame1Input: function(key, correct) {
		
		if (correct) {
			// check state -1=wait, 0=ready for input, 1=after input (correct/incorrect)
			if (this.gamestate == -1) {
				// too early
				var msec = Math.floor(this.waitevent.elapsed - this.waitevent.delay);
				console.log("doGame1Input -- TOO EARLY!! msec=" + msec);
				this.debugTextGame1("te vroeg " + msec + "ms");
				// log result
				this.doGameResult(msec);
			} else if (this.gamestate == 0) {
				// cancel timeout
				this._timeout.remove();

				// measure time
				var endtime = new Date();
				var msec = endtime - this.starttime;
				console.log('doGame1Input -- OK end time msec=' + msec);
				this.debugTextGame1("OK " + msec + "ms");

				// log result
				this.doGameResult(msec);

				// repeat 10 times for each hand or end game
				this.game_repeat++;
				if (this.game_repeat < this.repeat_max) {
					this.doStartPlus();
				} else {
					this.doGameEnd();
				};
			};
		} else {
			// incorrect button, ignore
		};
	},

    doGame1KeyDown: function(evt) {
		// variables
		var spr;
		var ok = false;
		var x;

		// key Z (=left)
		if (evt.keyCode == 90) {
			spr = this.key_left;
			x = 60;
			ok = (2-globalvar.dominant == globalvar.game_part); // als rechtshandig en niet-dominante test (deel 1)
			this.doGame1Input(CONST_LEFT, ok);
		};

		// key M (=right)
		if (evt.keyCode == 77) {
			spr = this.key_right;
			x = GAME_WIDTH-60;
			ok = (globalvar.dominant+1 == globalvar.game_part); // als rechtshandig en dominante test (deel 2)
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
				timeline.add({targets: spr, x: x+4, ease: 'Power1', duration: 40});
				timeline.add({targets: spr, x: x-4, ease: 'Power1', duration: 40});
				timeline.add({targets: spr, x: x,   ease: 'Power1', duration: 40});
				timeline.play();
			};
		};
	},
	
    doGame1KeyUp: function(evt, a, b, c) {
		// key Z
		if (evt.keyCode == 90) {
			this.key_left.setAlpha(0.5);
		};
		// key M
		if (evt.keyCode == 77) {
			this.key_right.setAlpha(0.5);
		};
	},
	
    doTimeout: function()
    {
		console.log("doTimeout -- called, cancel current game");

		if (globalvar.practise == false) {
			// timout go to bumper to retry this game
			this.scene.start("bumper", {timeout: true});
		};
	},

    debugTextGame1: function(str)
    {
		var txt = "debug: part " + globalvar.game_part + " keer " + (this.game_repeat+1) + " " + str + "\nDominant = " + (globalvar.dominant == CONST_LEFT ? "LEFT" : "RIGHT");
		this.debugtxt.text = txt;
	},
	
    doGameResult: function(msec)
    {
        console.log("doGameResult -- idx=" + this.game_repeat + " msec=" + msec);
		
		// game results and times
		//this._results[this.game_repeat] = ??;
		this._times[this.game_repeat]  = msec;
	},

    doGameEnd: function()
    {
        console.log("gamescene doBack was called!");
		if (globalvar.practise) {
			// keuze oefenen of echte test
			this.scene.start("bumper");
		} else {
			// save results
			//PkuData.saveResults(globalvar.game, globalvar.game_part, this._times, this._results);
			var data  = {"times": this._times, "results": this._results};
			this.scene.start("gamesave", data);

			// next part, non-dominant hand to dominant hand
			//globalvar.game_part++;
			//if (globalvar.game_part <= 2) {
			//	this.scene.start("tutorial1");
			//} else {
			//	// dominant hand afgerond, eind scherm test 1
			//	this.scene.start("gameend");
			//};
		};
    }

});
