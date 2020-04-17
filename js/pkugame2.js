// Phaser3 PKU test webgame
// game 2

var GAME2_REPEAT = 10;

// main game logic object
var PKUgame2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PKUgame2 ()
    {
        Phaser.Scene.call(this, { key: "pkugame2" });
    },

    preload: function ()
    {

    },
	
    init: function (data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);

		// !! TESTING !!
		globalvar.game = 2;
		globalvar.game_part = 3;
		globalvar.practise = false;
    },

    create: function ()
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
		// determine next color
		if (globalvar.game_part < 3) {
			this.square_col = globalvar.game_part - 1; // part1=green, part2=red
		} else {
			this.square_col = Phaser.Math.RND.between(0, 1); // part3=random
		};

		// reset square
		this.squares[this.square_pos].setFrame("block2_" + (this.square_col+1) );
		this.gamestate = -1; // -1=wait
		
		// set random timer
		var msec = Phaser.Math.RND.between(500, 2500); // 0,5 and 2,5 seconds
		this.waitevent = this.time.addEvent({ delay: msec, callback: this.onMoveSquare, callbackScope: this});
	},
	
    onMoveSquare: function () {
		// make current white
		this.squares[this.square_pos].setFrame("block2_0");

		// first or last square, can only move one direction
		if ( (this.square_pos == 0) || (this.square_pos == 9) ) {
			this.square_dir = (this.square_pos == 0 ? 1 : 0);
		} else {
			this.square_dir = Phaser.Math.RND.between(0, 1); // 0=left, 1=right
		};
		this.square_pos = this.square_pos + (this.square_dir == 0 ? -1 : +1);

		// stay within bounds 0..9
		//this.square_pos = Math.min(Math.max(this.square_pos, 0), 9);
		
		// display square in current position
		this.squares[this.square_pos].setFrame("block2_" + (this.square_col+1) );

		// now wait for user input
		this.gamestate = 0; // -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		this.starttime = new Date();
	},
	
    doGame2Input: function (key, correct) {
		
		// check state -1=wait, 0=ready for input, 1=after input (correct/incorrect)
		if (this.gamestate == -1) {
			// too early
			var msec = Math.floor(this.waitevent.elapsed - this.waitevent.delay);
			console.log("doGame2Input -- TOO EARLY!! msec=" + msec);
			// log result
			this.doGameResult(this.game_repeat, msec, false);
		} else if (this.gamestate == 0) {
			// measure time
			var endtime = new Date();
			var msec = endtime - this.starttime;
			console.log('dogame2Input -- OK end time msec=' + msec);

			// log result
			this.doGameResult(this.game_repeat, msec, correct);

			// repeat 10 times for each hand or end game
			this.game_repeat++;
			if (this.game_repeat < GAME2_REPEAT) {
				this.doStartSquare();
			} else {
				this.doGameEnd();
			};
		};
	},

    doGame2KeyDown: function (evt) {
		// variables
		var spr;
		var ok = false;
		var x;

		// key Z (=left)
		if (evt.keyCode == 90) {
			spr = this.key_left;
			x = 60;
			ok = (this.square_dir == this.square_col); // als move left and green (dir=0 & col=0 OR dir=1 & col=1)
			this.doGame2Input(CONST_LEFT, ok);
		};

		// key M (=right)
		if (evt.keyCode == 77) {
			spr = this.key_right;
			x = GAME_WIDTH-60;
			ok = (this.square_dir + this.square_col == 1); // als move right and green (dir=1 & col=0 OR dir=0 & col=1)
			this.doGame2Input(CONST_RIGHT, ok);
		};

		// if Z or M pressed
		if (spr) {
			// display key pressed
			spr.setAlpha(1.0);
		};
	},
	
    doGame2KeyUp: function (evt, a, b, c) {
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
