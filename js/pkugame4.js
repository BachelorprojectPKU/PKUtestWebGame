// Phaser3 PKU test webgame
// game 4

// main game logic object
var PKUgame4 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PKUgame4()
    {
        Phaser.Scene.call(this, { key: "pkugame4" });
    },

    preload: function()
    {

    },
	
    init: function(data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);

		globalvar.game = 4;
		// !! TESTING !!
		//globalvar.game_part = 4;
		//globalvar.practise = false;
    },

    create: function()
    {
		// background color
		var clr  = (globalvar.practise ? BACKGROUND_BLUE : BACKGROUND_BLACK);
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(clr);
		
		// face smiley
		this._face = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "faces1", 1);
		this._emotions = ["happy", "sad", "angry", "scared", "disgust", "surprised"]; // first in array is goal face
		this._face_idx = 0;
		this._face_goal = false;

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
		this._emotion_goal = 1; // 0=other emotion, 1=correct emotion
		this._emotion_idx = 1; // current displayed emotion 1=happy, 2=sad etc.
		this.gamestate = -1; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)

		// key sprites
		this.key_left  = this.add.sprite(           60, GAME_HEIGHT-60, "sprites", "key_z");
		this.key_right = this.add.sprite(GAME_WIDTH-60, GAME_HEIGHT-60, "sprites", "key_m");
		this.key_left.setAlpha(0.5);
		this.key_right.setAlpha(0.5);
		
		var b_left = (globalvar.dominant == CONST_LEFT);
		var left_icon  = this.add.sprite(           60, GAME_HEIGHT-130, "sprites", (b_left ? "icon_yes" : "icon_no") );
		var right_icon = this.add.sprite(GAME_WIDTH-60, GAME_HEIGHT-130, "sprites", (b_left ? "icon_no" : "icon_yes") );
		left_icon.setAlpha(0.5);
		right_icon.setAlpha(0.5);

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
		this.repeat_max = (globalvar.practise ? GAME4_REPEAT_PRACTISE : GAME4_REPEAT);

		// keep track of how many practice times
		if (globalvar.practise) globalvar.practisecount++;

		// game results and times
		this._results = [];
		this._times  = [];

		this.waitevent = null;

		// !! TESTING !!
		this.debugtxt = this.add.bitmapText(60, 10, "fontwhite", "test123", 24);
		
		// start game
		this.doStartNext();
    },
	
    update: function(time, delta)
    {
		// test
    },
	
    render: function()
    {
    },
	
    doStartNext: function() {
		// face invisible
		this._face.visible = false;

		// wait 500ms for next test
		this.waitevent = this.time.addEvent({ delay: 500, callback: this.onShowFace, callbackScope: this});
		this.gamestate = -1; // -1=wait
    },

    onShowFace: function() {

		// choose random emotion
		this._face_idx = Phaser.Math.RND.between(0, 5); // random emotion
		this._face_goal = (this._chances[this.game_repeat] == 1);

		// if should now show goal emotion
		if (this._face_goal) {
			this._face_idx = globalvar.game_part - 1;
		} else {
			// should not show goal emotion
			if (this._face_idx == globalvar.game_part - 1) {
				// choose one of the 5 different emotions			
				this._face_idx = (this._face_idx + Phaser.Math.RND.between(1, 5) ) % 6; // modulo 6 -> values 0..5
			};
		};

		// get emotion text
		this._face_str = this._emotions[this._face_idx];
		
		// !! TESTING !!
		this.debugTextGame4("");

		// make new face visible
		this._face.setTexture("faces" + (this._face_idx+1));
		var frm = Phaser.Math.RND.between(0, 2); // 0..2, max 3 photos at the moment
		this._face.setFrame(frm);

		this._face.visible = true;

		// now wait for user input
		this.gamestate = 0; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		this.starttime = new Date();
		this._timeout = this.time.delayedCall(TIMEOUT_DELAY, this.doTimeout, null, this);
	},
	
    doGame4Input: function(key, correct) {
		
		// check state -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		if (this.gamestate == -1) {
			// too early
			var msec = Math.floor(this.waitevent.elapsed - this.waitevent.delay);
			// log result
			this.debugTextGame4("TOO EARLY!!", msec);
			//this.doGameResult(msec, false);
		} else if (this.gamestate == 0) {
			// cancel timeout
			this._timeout.remove();

			// measure time
			var endtime = new Date();
			var msec = endtime - this.starttime;
			console.log('dogame4Input -- OK end time msec=' + msec);

			// log result
			this.doGameResult(msec, correct);
			
			// !! TESTING !!
			this.debugTextGame4((correct ? " OK" : " INCORRECT"), msec);
			// !! TESTING !!

			// repeat 10 times for each hand or end game
			this.game_repeat++;
			if (this.game_repeat < this.repeat_max) {
				this.doStartNext();
			} else {
				this.doGameEnd();
			};
		};
	},

    doGame4KeyDown: function(evt) {
		// variables
		var spr;
		var ok = false;

		// key Z (=left)
		if (evt.keyCode == 90) {
			spr = this.key_left;
			
			ok = ( (this._face_goal) && (globalvar.dominant == CONST_LEFT) ) || ( (!this._face_goal) && (globalvar.dominant == CONST_RIGHT) );
			this.doGame4Input(CONST_LEFT, ok);
		};

		// key M (=right)
		if (evt.keyCode == 77) {
			spr = this.key_right;
			ok = ( (this._face_goal) && (globalvar.dominant == CONST_RIGHT) ) || ( (!this._face_goal) && (globalvar.dominant == CONST_LEFT) );
			this.doGame4Input(CONST_RIGHT, ok);
		};

		// if Z or M pressed
		if (spr) {
			// display key pressed
			spr.setAlpha(1.0);
		};
	},
	
    doGame4KeyUp: function(evt) {
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
		console.log("doTimeout game4 -- called, cancel current game");

		if (globalvar.practise == false) {
			// timout go to bumper to retry this game
			this.scene.start("bumper", {timeout: true});
		};
	},

    debugTextGame4: function(str, ms)
    {
		var txt = "debug: part " + globalvar.game_part + " " + this._emotions[0].toUpperCase() + " keer " + (this.game_repeat+1) + " " + (this._face_goal ? " DOEL" : " niet-doel");

		txt = txt + " " + str;
		
		if (typeof ms !== "undefined") {
			txt = txt + " msec=" + ms;
		};

		txt = txt + "\nDominant = " + (globalvar.dominant == CONST_LEFT ? "LEFT" : "RIGHT");

		this.debugtxt.text = txt;
	},

    doGameResult: function(msec, cor)
    {
        console.log("doGameResult -- idx=" + this.game_repeat + " msec=" + msec);

		// when pressed too early, keep that result and don't overwrite
		if (typeof this._times[this.game_repeat] === "undefined") {
			// coded result, example HAPok, ANGok, SADer etc.
			var cod = (this._emotions[this._face_idx]).toUpperCase().substring(0, 3)
					+ (cor ? "ok" : "er");

			// game results and times
			this._results[this.game_repeat] = cod;
			this._times[this.game_repeat]  = msec;
		};
	},

    doGameEnd: function()
    {
        console.log("gamescene doBack was called!");
		if (globalvar.practise) {
			// keuze oefenen of echte test
			this.scene.start("bumper");
		} else {
			// save results
			var data  = {"times": this._times, "results": this._results};
			this.scene.start("gamesave", data);

			// next emotion
			//globalvar.game_part++;
			//if (globalvar.game_part <= 4) {
			//	this.scene.start("tutorial4");
			//} else {
			//	// alle emotions afgerond, eind scherm test 4
			//	this.scene.start("gameend");
			//};
		};
    }

});
