// Phaser3 PKU test webgame
// game 4

var GAME4_REPEAT = 10;

// main game logic object
var PKUgame4 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PKUgame4 ()
    {
        Phaser.Scene.call(this, { key: "pkugame4" });
    },

    preload: function ()
    {

    },
	
    init: function (data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);

		// !! TESTING !!
		globalvar.game = 4;
		globalvar.game_part = 3;
		globalvar.practise = false;
    },

    create: function ()
    {
		// background color
		var clr  = (globalvar.practise ? BACKGROUND_BLUE : BACKGROUND_BLACK);
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(clr);
		
		// face smiley
		this._face = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "sprites", "game4_happy");
		this._emotions = ["happy", "sad", "angry", "scared"]; // first in array is goal face

		// randomise the chances of displaying goal pattern
		this._chances = [];
		for (var i=0; i < GAME4_REPEAT; i++) {
			this._chances[i] = (i % 2==0);
		};
		// shuffle
		for (var i=0; i < GAME4_REPEAT*10; i++) {
			// choose random position
			var idx1 = Phaser.Math.RND.between(0, GAME4_REPEAT-1);
			var idx2 = Phaser.Math.RND.between(0, GAME4_REPEAT-1);
			// switch
			var tmp = this._chances[idx2];
			this._chances[idx2] = this._chances[idx1];
			this._chances[idx1] = tmp;
		};
		this.goal_emotion = 1; // 0=other emotion, 1=correct emotion
		this.gamestate = -1; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)

		// key sprites
		this.key_left  = this.add.sprite(           60, GAME_HEIGHT-60, "sprites", "key_z");
		this.key_right = this.add.sprite(GAME_WIDTH-60, GAME_HEIGHT-60, "sprites", "key_m");

		this.key_left.setAlpha(0.5);
		this.key_right.setAlpha(0.5);

		// !! TESTING !!
		//this.input.keyboard.on('keydown-' + 'Z', this.test123, this);
		//this.input.keyboard.on('keydown-' + 'X', this.test456, this);
		//this.input.keyboard.on('keydown-' + 'C', this.test789, this);
		// !! TESTING !!
		
		// key input handler
		this.input.keyboard.on('keydown', this.doGame4KeyDown, this);
		this.input.keyboard.on('keyup',   this.doGame4KeyUp, this);

		// reset repeat counter
		this.game_repeat = 0;
		this.waitevent = null;

		// !! TESTING !!
		this.debugtxt = this.add.bitmapText(60, 10, "fontwhite", "test123", 24);
		
		// start game
		this.doStartNext();
    },
	
    update: function (time, delta)
    {
		// test
    },
	
    render: function ()
    {
    },
	
    doStartNext: function () {
		// face invisible
		this._face.visible = false;

		// wait 500ms for next test
		this.waitevent = this.time.addEvent({ delay: 500, callback: this.onShowFace, callbackScope: this});
		this.gamestate = -1; // -1=wait
    },

    onShowFace: function () {

		// choose random emotion
		if (this._chances[this.game_repeat] == 1) {
			this.rnd_face = 0; // current goal-emotion
		} else {
			this.rnd_face = Phaser.Math.RND.between(1, 3); // random other than goal-emotion
		};

		// get emotion text
		var str = this._emotions[this.rnd_face];
		
		// !! TESTING !!
		this.debugtxt.text = "debug: current=" + str + (this.rnd_face==0 ? " DOEL" : " niet-doel");
		// !! TESTING !!

		// make new face visible
		this._face.setFrame("game4_"+str);
		this._face.visible = true;

		// now wait for user input
		this.gamestate = 0; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		this.starttime = new Date();
	},
	
    doGame4Input: function (key, correct) {
		
		// check state -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		if (this.gamestate == -1) {
			// too early
			var msec = Math.floor(this.waitevent.elapsed - this.waitevent.delay);
			console.log("doGame4Input -- TOO EARLY!! msec=" + msec);
			// log result
			//this.doGameResult(this.game_repeat, msec, false);
		} else if (this.gamestate == 0) {
			// measure time
			var endtime = new Date();
			var msec = endtime - this.starttime;
			console.log('dogame4Input -- OK end time msec=' + msec);

			// log result
			this.doGameResult(this.game_repeat, msec, correct);
			
			// !! TESTING !!
			this.debugtxt.text += (correct ? " GOED" : " FOUT");
			// !! TESTING !!

			// repeat 10 times for each hand or end game
			this.game_repeat++;
			if (this.game_repeat < GAME4_REPEAT) {
				this.doStartNext();
			} else {
				this.doGameEnd();
			};
		};
	},

    doGame4KeyDown: function (evt) {
		// variables
		var spr;
		var ok = false;

		// key Z (=left)
		if (evt.keyCode == 90) {
			spr = this.key_left;
			
			ok = ( (this.rnd_face == 0) && (globalvar.dominant == CONST_LEFT) ) || ( (this.rnd_face != 0) && (globalvar.dominant == CONST_RIGHT) );
			this.doGame4Input(CONST_LEFT, ok);
		};

		// key M (=right)
		if (evt.keyCode == 77) {
			spr = this.key_right;
			ok = ( (this.rnd_face == 0) && (globalvar.dominant == CONST_RIGHT) ) || ( (this.rnd_face != 0) && (globalvar.dominant == CONST_LEFT) );
			this.doGame4Input(CONST_RIGHT, ok);
		};

		// if Z or M pressed
		if (spr) {
			// display key pressed
			spr.setAlpha(1.0);
		};
	},
	
    doGame4KeyUp: function (evt) {
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
			// next emotion
			globalvar.game_part++;
			if (globalvar.game_part <= 3) {
				this.scene.start("tutorial4");
			} else {
				// alle emotions afgerond, eind scherm test 4
				this.scene.start("gameend");
			};
		};
    }

});
