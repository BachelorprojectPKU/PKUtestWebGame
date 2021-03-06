// Phaser3 PKU test webgame
// game 3

// main game logic object
var PKUgame3 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PKUgame3()
    {
        Phaser.Scene.call(this, { key: "pkugame3" });
    },

    preload: function()
    {

    },
	
    init: function(data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);

		globalvar.game = 3;
		// !! TESTING !!
		//globalvar.game_part = 3;
		//globalvar.practise = false;
    },

    create: function()
    {
		// background color
		var clr  = (globalvar.practise ? BACKGROUND_BLUE : BACKGROUND_BLACK);
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(clr);
		
		this._plus = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "sprites", "game3_plus");

		// randomise the chances of displaying goal pattern
		this._chances = [];
		for (var i=0; i < GAME3_REPEAT; i++) {
			this._chances[i] = (i % 2==0);
		};
		// shuffle
		for (var i=0; i < GAME3_REPEAT*10; i++) {
			// choose random position
			var idx1 = Phaser.Math.RND.between(0, GAME3_REPEAT-1);
			var idx2 = Phaser.Math.RND.between(0, GAME3_REPEAT-1);
			// switch
			var tmp = this._chances[idx2];
			this._chances[idx2] = this._chances[idx1];
			this._chances[idx1] = tmp;
		};

		// create sprites for 4x3x3 grids
		this.squares = [];
		for (var i=0; i < 4; i++) {
			// four blocks
			this.squares[i] = [];
			var xctr = (i == 0 || i == 2 ? GAME_WIDTH_CENTER-80  : GAME_WIDTH_CENTER+80);
			var yctr = (i == 0 || i == 1 ? GAME_HEIGHT_CENTER-80 : GAME_HEIGHT_CENTER+80);
			// create a grid of 3x3 blocks
			for (var y=0; y < 3; y++) {
				this.squares[i][y] = [];
				for (var x=0; x < 3; x++) {
					// squares are 80x80px, width=960px
					var xpos = xctr + ((x-1) * 32);
					var ypos = yctr + ((y-1) * 32);
					this.squares[i][y][x] = this.add.sprite(xpos, ypos, "sprites", "game3_white");
				};
			};
		};

		this.game_similar = 0; // 0=dissimilar, 1=similar(contains goal pattern)
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
		this.input.keyboard.on('keydown', this.doGame3KeyDown, this);
		this.input.keyboard.on('keyup',   this.doGame3KeyUp, this);

		// reset repeat counter
		this.game_repeat = 0;
		this.repeat_max = (globalvar.practise ? GAME3_REPEAT_PRACTISE : GAME3_REPEAT);

		// keep track of how many practice times
		if (globalvar.practise) globalvar.practisecount++;
		
		// game results and times
		this._results = [];
		this._times  = [];
		
		this.waitevent = null;

		// !! TESTING !!
		this.debugtxt = this.add.bitmapText(60, 10, "fontwhite", "", 24);
		
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
		// make all squares invisible
		for (var i=0; i < 4; i++) {
			for (var y=0; y < 3; y++) {
				for (var x=0; x < 3; x++) {
					this.squares[i][y][x].visible = false;
				};
			};
		};

		// wait 500ms for next test
		this.waitevent = this.time.addEvent({ delay: 500, callback: this.onShowSquares, callbackScope: this});
		this.gamestate = -1; // -1=wait
    },

    onShowSquares: function() {

		// choose 3 random grid nrs
		this.game_similar = this._chances[this.game_repeat];
		
		// when showing goal pattern, which of 4 grids, choose random
		var dogoal = (this.game_similar == 1 ? Phaser.Math.RND.between(0, 3) : -1);
		
		// !! TESTING !!
		this.game_similar_txt = (dogoal < 3 ? (dogoal < 2 ? (dogoal < 1 ? (dogoal < 0 ? "no" : "left-top") : "right-top") : "left-bottom") : "right-bottom");
		this.debugTextGame3("");
		// !! TESTING !!

		for (var i=0; i < 4; i++) {
			// select a random grid pattern
			var tmp = [];
			// for each row; 0=no red, 1=red left, 2=red center, 3=red right
			tmp[0] = Phaser.Math.RND.between(0, 3); // row 0 (top)
			tmp[1] = Phaser.Math.RND.between(0, 3); // row 1 (middle)
			tmp[2] = Phaser.Math.RND.between(0, 3); // row 2 (bottom)

			// should now show the fixed goal pattern
			if (i == dogoal) {
				tmp[0] = 1;
				tmp[1] = 3;
				tmp[2] = 2;
			} else if ((tmp[0] == 1) && (tmp[1] == 3) && (tmp[2] == 2)) {
				// should not show fixed goal pattern, but selected it randomly 'by accident'
				// force a different pattern
				tmp[0] = (tmp[0] + Phaser.Math.RND.between(1, 3)) % 4; // modulo 4 will result in 0..3
				tmp[1] = (tmp[1] + Phaser.Math.RND.between(1, 3)) % 4;
				tmp[1] = (tmp[1] + Phaser.Math.RND.between(1, 3)) % 4;
			};

			// create a grid of 3x3 blocks
			for (var y=0; y < 3; y++) {
				for (var x=0; x < 3; x++) {
					// set square color
					var str = (tmp[y]-1 == x ? "red" : "white");
					this.squares[i][y][x].setFrame("game3_"+str);
					this.squares[i][y][x].visible = true;
				};
			};
		};

		// now wait for user input
		this.gamestate = 0; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		this.starttime = new Date();
		this._timeout = this.time.delayedCall(TIMEOUT_DELAY, this.doTimeout, null, this);
	},
	
    doGame3Input: function(key, correct) {
		
		// check state -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		if (this.gamestate == -1) {
			// too early
			var msec = Math.floor(this.waitevent.elapsed - this.waitevent.delay);
			console.log("doGame3Input -- TOO EARLY!! msec=" + msec);
			// log result
			this.debugTextGame3("TOO EARLY!!", msec);
			//this.doGameResult(msec, false);
		} else if (this.gamestate == 0) {
			// cancel timeout
			this._timeout.remove();

			// measure time
			var endtime = new Date();
			var msec = endtime - this.starttime;
			console.log('dogame3Input -- OK end time msec=' + msec);

			// log result
			this.doGameResult(msec, correct);
			
			// !! TESTING !!
			this.debugTextGame3((correct ? "GOED" : "FOUT"), msec);
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

    doGame3KeyDown: function(evt) {
		// variables
		var spr;
		var ok = false;

		// key Z (=left)
		if (evt.keyCode == 90) {
			spr = this.key_left;
			
			ok = ( (this.game_similar == 1) && (globalvar.dominant == CONST_LEFT) ) || ( (this.game_similar != 1) && (globalvar.dominant == CONST_RIGHT) );
			this.doGame3Input(CONST_LEFT, ok);
		};

		// key M (=right)
		if (evt.keyCode == 77) {
			spr = this.key_right;
			ok = ( (this.game_similar == 1) && (globalvar.dominant == CONST_RIGHT) ) || ( (this.game_similar != 1) && (globalvar.dominant == CONST_LEFT) );
			this.doGame3Input(CONST_RIGHT, ok);
		};

		// if Z or M pressed
		if (spr) {
			// display key pressed
			spr.setAlpha(1.0);
		};
	},
	
    doGame3KeyUp: function(evt, a, b, c) {
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
		console.log("doTimeout game3 -- called, cancel current game");

		if (globalvar.practise == false) {
			// timout go to bumper to retry this game
			this.scene.start("bumper", {timeout: true});
		};
	},

    debugTextGame3: function(str, ms)
    {
		//if (typeof ms !== "undefined") {
		//	str = str + " msec=" + ms;
		//};
		//
		//this.debugtxt.text = "debug: goal " + this.game_similar_txt + " " + str + "\nDominant = " + (globalvar.dominant == CONST_LEFT ? "LEFT" : "RIGHT");
	},

    doGameResult: function(msec, cor)
    {
        console.log("doGameResult -- idx=" + this.game_repeat + " msec=" + msec);
		
		// when pressed too early, keep that result and don't overwrite
		if (typeof this._times[this.game_repeat] === "undefined") {
			// coded result, example SIMok, DISok, SIMer, DISni etc.
			var cod = (this.game_similar == 1 ? "SIM" : "DIS")
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

			// next part: geen next part voor deze game3
			//globalvar.game_part++;
			//if (globalvar.game_part <= 1) {
			//	this.scene.start("tutorial3");
			//} else {
			//	// test afgerond, eind scherm test 3
			//	this.scene.start("gameend");
			//};
		};
    }

});
