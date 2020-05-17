// Phaser3 PKU test webgame
// game 2

// main game logic object
var PKUgame2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PKUgame2()
    {
        Phaser.Scene.call(this, { key: "pkugame2" });
    },

    preload: function()
    {

    },
	
    init: function(data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);

		globalvar.game = 2;
		// !! TESTING !!
		//globalvar.game_part = 1;
		//globalvar.practise = false;
    },

    create: function()
    {
		// background color
		var clr  = (globalvar.practise ? BACKGROUND_BLUE : BACKGROUND_BLACK);
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(clr);
		
		this.squares = [];
		for (var i=0; i < 10; i++) {
			// squares are 80x80px, width=960px
			var x = 80 + ((80 + 8) * i);
			this.squares[i] = this.add.sprite(x, GAME_HEIGHT_CENTER, "sprites", "block2_0");
		};
		this.square_pos = 5;
		this.square_col = 0; // 0=green, 1=red
		this.square_dir = 0;
		this.expect_btn = 0;

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
		this.input.keyboard.on('keydown', this.doGame2KeyDown, this);
		this.input.keyboard.on('keyup',   this.doGame2KeyUp, this);

		// reset repeat counter
		this.game_repeat = 0;
		this.repeat_max = (globalvar.practise ? GAME2_REPEAT_PRACTISE : GAME2_REPEAT);

		// keep track of how many practice times
		if (globalvar.practise) globalvar.practisecount++;
		
		// game results and times
		this._results = [];
		this._times  = [];

		this.waitevent = null;

		// !! TESTING !!
		this.debugtxt = this.add.bitmapText(60, 10, "fontwhite", "debug:", 24);
 
		// start game
		this.doStartSquare();
    },
	
    update: function(time, delta)
    {
		// test
    },
	
    render: function()
    {
    },
	
    doStartSquare: function() {
		// determine next color
		if (globalvar.game_part < 3) {
			this.square_col = globalvar.game_part - 1; // part1=green, part2=red
		} else {
			this.square_col = Phaser.Math.RND.between(0, 1); // part3=random
		};

		// show current square
		this.squares[this.square_pos].setFrame("block2_" + (this.square_col+1) );
		this.gamestate = -1; // -1=wait
		
		// set random timer
		var msec = Phaser.Math.RND.between(500, 2500); // 0,5 and 2,5 seconds

		// exception, first time always wait 2 sec so player can adjust to new game screen
		if (this.game_repeat == 0) msec = 2000;

		this.waitevent = this.time.addEvent({ delay: msec, callback: this.onMoveSquare, callbackScope: this});
	},
	
    onMoveSquare: function() {
		// make current square white
		this.squares[this.square_pos].setFrame("block2_0");

		// first or last square, can only move one direction
		if ( (this.square_pos == 0) || (this.square_pos == 9) ) {
			this.square_dir = (this.square_pos == 0 ? CONST_RIGHT : CONST_LEFT);
		} else {
			this.square_dir = Phaser.Math.RND.between(0, 1); // 0=left, 1=right
		};
		this.square_pos = this.square_pos + (this.square_dir == CONST_LEFT ? -1 : +1);

		// which button should player push
		if (this.square_col == 0) {
			// green
			this.expect_btn = (this.square_dir == CONST_LEFT ? CONST_LEFT : CONST_RIGHT);
		} else {
			// red
			this.expect_btn = (this.square_dir == CONST_RIGHT ? CONST_LEFT : CONST_RIGHT);
		};

		// stay within bounds 0..9
		//this.square_pos = Math.min(Math.max(this.square_pos, 0), 9);
		
		// display square in current position
		this.squares[this.square_pos].setFrame("block2_" + (this.square_col+1) );

		// now wait for user input
		this.gamestate = 0; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		this.starttime = new Date();
		this._timeout = this.time.delayedCall(TIMEOUT_DELAY, this.doTimeout, null, this);
		
		this.debugTextGame2();
	},
	
    doGame2Input: function(key, correct) {
		
		// check state -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		if (this.gamestate == -1) {
			// too early
			var msec = Math.floor(this.waitevent.elapsed - this.waitevent.delay);
			console.log("doGame2Input -- TOO EARLY!! msec=" + msec);
			this.debugTextGame2(msec);

			// log result
			this.doGameResult(msec, false);
		} else if (this.gamestate == 0) {
			// cancel timeout
			this._timeout.remove();

			// measure time
			var endtime = new Date();
			var msec = endtime - this.starttime;
			console.log("dogame2Input -- OK end time msec=" + msec);
			this.debugTextGame2(msec, correct);

			// log result
			this.doGameResult(msec, correct);

			// repeat 10 times for each hand or end game
			this.game_repeat++;
			if (this.game_repeat < this.repeat_max) {
				this.doStartSquare();
			} else {
				this.doGameEnd();
			};
		};
	},

    doGame2KeyDown: function(evt) {
		// variables
		var spr;
		var ok = false;
		var x;

		// key Z (=left)
		if (evt.keyCode == 90) {
			spr = this.key_left;
			x = 60;
			ok = (this.expect_btn == CONST_LEFT);
			this.doGame2Input(CONST_LEFT, ok);
		};

		// key M (=right)
		if (evt.keyCode == 77) {
			spr = this.key_right;
			x = GAME_WIDTH-60;
			ok = (this.expect_btn == CONST_RIGHT);
			this.doGame2Input(CONST_RIGHT, ok);
		};

		// if Z or M pressed
		if (spr) {
			// display key pressed
			spr.setAlpha(1.0);
		};
	},
	
    doGame2KeyUp: function(evt, a, b, c) {
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
		console.log("doTimeout game2 -- called, cancel current game");

		if (globalvar.practise == false) {
			// timout go to bumper to retry this game
			this.scene.start("bumper", {timeout: true});
		};
	},
	
    debugTextGame2: function(ms, cr)
    {
		var txt = "debug: part " + globalvar.game_part + " moved ";

		if (this.gamestate == -1) {
			txt = txt + "?? TOO EARLY!!"
		} else {
			txt = txt + (this.square_dir == CONST_LEFT ? "left" : "right") + " press " + (this.expect_btn == CONST_LEFT ? "left" : "right");
		};
		
		if (typeof cr !== "undefined") {
			txt = txt + " " + (cr ? "OK" : "INCORRECT");
		};

		if (typeof ms !== "undefined") {
			txt = txt + " msec=" + ms;
		};

		this.debugtxt.text = txt;
	},

    doGameResult: function(msec, cor)
    {
        console.log("doGameResult -- idx=" + this.game_repeat + " msec=" + msec);

		// coded result, example LE1ok, LE2ok, RI1er, RI2ni etc.
		var cod = (this.expect_btn == CONST_LEFT ? "LE" : "RI")
				+ (this.square_col+1)
				+ (cor ? "ok" : "er");

		// game results and times
		this._results[this.game_repeat] = cod;
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
			PkuData.saveResults(globalvar.game, globalvar.game_part, this._times, this._results);

			// next part: groen, rood, groen+rood
			globalvar.game_part++;
			if (globalvar.game_part <= 3) {
				this.scene.start("tutorial2");
			} else {
				// dominant hand afgerond, eind scherm test 2
				this.scene.start("gameend");
			};
		};
    }

});
