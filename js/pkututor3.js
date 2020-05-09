// Phaser3 PKU test webgame
// game 3 tutorial

// tutorial game3
var Tutorial3 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Tutorial3()
    {
        Phaser.Scene.call(this, { key: "tutorial3" });
    },

    preload: function()
    {

    },
	
    init: function(data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);
		
		// set global variables
		globalvar.practise = true;
		globalvar.game = 3;
		//globalvar.game_part = 1; // game_part is updated in GameEnd scene
    },

    create: function()
    {
		// banner at top of screen
		var recttile = createRectangle(this, 0, 30, 960, 60, 0x0000ff, 1.0);
		var txttitle1 = this.add.bitmapText(60, 40, "fontwhite", "TEST 3: PATROON HERKENNEN", 24);

		// dominante hand is JA knop
		var btn_yes = (globalvar.dominant == CONST_RIGHT ? "M" : "Z");
		var btn_no  = (globalvar.dominant == CONST_RIGHT ? "Z" : "M");

		// --- tutorial message 1 ---
		this._cntTutor1 = this.add.container();
		var str = "Nu gaan we beginnen met test 3\nBij deze test gaat het om het herkennen van een patroon.\nHet gaat om dit patroon:\nOnthoud deze goed!";
		var txt1 = this.add.bitmapText(60, 120,     "fontwhite", str, 24);
		var btn1 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext1,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "verder");
		
		var sq1 = this.addSquaresGrid(this._cntTutor1, GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER);
		this.setSquaresGrid(sq1, true);

		// add all to container
		this._cntTutor1.add(txt1);
		this._cntTutor1.add(btn1);

		// --- tutorial message 2 ---
		this._cntTutor2 = this.add.container();

		str = "Zometeen krijg je steeds 4 patronen te zien,\nwanneer je dit patroon herkent druk je op de JA-knop (" + btn_yes + "),\nwanneer je het patroon niet herkent druk je op de NEE-knop (" + btn_no + ")";
		
		var txt2 = this.add.bitmapText(60, 120,     "fontwhite", str, 24);

		var btn2 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext2,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "verder");
		
		
		var plus = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER+40, "sprites", "game3_plus");
		// create sprites for 4x3x3 grids
		this.squares = [];
		for (var i=0; i < 4; i++) {
			// four blocks
			//this.squares[i] = [];
			var xctr = (i == 0 || i == 2 ? GAME_WIDTH_CENTER-80  : GAME_WIDTH_CENTER+80);
			var yctr = (i == 0 || i == 1 ? GAME_HEIGHT_CENTER-80 : GAME_HEIGHT_CENTER+80) + 40;

			var sq2 = this.addSquaresGrid(this._cntTutor2, xctr, yctr);
			this.setSquaresGrid(sq2, false);
			this.squares[i] = sq2;
		};
		
		this._key_1 = this.add.sprite(GAME_WIDTH_CENTER-260, GAME_HEIGHT_CENTER+120, "sprites", "key_z");
		this._key_2 = this.add.sprite(GAME_WIDTH_CENTER+260, GAME_HEIGHT_CENTER+120, "sprites", "key_m");
		this._hand1 = this.add.sprite(GAME_WIDTH_CENTER+260, GAME_HEIGHT_CENTER+200, "sprites", "hand_point"); // dominant
		this._hand2 = this.add.sprite(GAME_WIDTH_CENTER-260, GAME_HEIGHT_CENTER+200, "sprites", "hand_point"); // niet-dominant
		this._arrow = this.add.sprite(GAME_WIDTH_CENTER+260, GAME_HEIGHT_CENTER+200, "sprites", "arrow_tut3");
		
		// linker hand is dominant
		if (globalvar.dominant == CONST_LEFT) {
			this._hand1.x = GAME_WIDTH_CENTER-260;
			this._hand2.x = GAME_WIDTH_CENTER+260;
			this._hand1.setScale(-1.0, 1.0); // left hand
		} else {
			this._hand2.setScale(-1.0, 1.0); // left hand
		};

		this._cntTutor2.add(this._key_1);
		this._cntTutor2.add(this._key_2);
		this._cntTutor2.add(this._hand1);
		this._cntTutor2.add(this._hand2);
		this._cntTutor2.add(this._arrow);

		this._cntTutor2.add(plus);
		this._cntTutor2.add(txt2);
		this._cntTutor2.add(btn2);
		
		// --- tutorial message 3 ---
		this._cntTutor3 = this.add.container();
		str = "Het gaat om dit patroon:\nOnthoud deze goed !\nDit gaan we eerst even oefenen."
		var txt3 = this.add.bitmapText(60, 120,  "fontwhite", str, 24);
		var btn3 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1", "Oefenen");
		
		var sq3 = this.addSquaresGrid(this._cntTutor3, GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER);
		this.setSquaresGrid(sq3, true);

		this._cntTutor3.add(txt3);
		this._cntTutor3.add(btn3);

		// only main menu visible
		//this._cntTutor1.visible = false;
		this._cntTutor2.visible = false;
		this._cntTutor3.visible = false;

		this._repeatdemo = 0;

		console.log("Tutorial3 create is ready");
    },

    //update: function(time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function()
    //{
	//	// test debug text
    //},
	
	addSquaresGrid: function(cnt, xctr, yctr)
    {
		// create sprites for 3x3 grid
		var sqrs = [];

		// create a grid of 3x3 blocks
		for (var y=0; y < 3; y++) {
			sqrs[y] = [];
			for (var x=0; x < 3; x++) {
				// squares are 80x80px, width=960px
				var xpos = xctr + ((x-1) * 32);
				var ypos = yctr + ((y-1) * 32);
				var spr    = this.add.sprite(xpos, ypos, "sprites", "game3_white");
					
				sqrs[y][x] = spr;
				cnt.add(spr);
			};
		};
		return sqrs;
	},

	setSquaresGrid: function(sqrs, fix)
	{
	
		// select a random grid pattern
		var tmp = [];
		// for each row; 0=no red, 1=red left, 2=red center, 3=red right
		tmp[0] = Phaser.Math.RND.between(0, 3); // row 0 (top)
		tmp[1] = Phaser.Math.RND.between(0, 3); // row 1 (middle)
		tmp[2] = Phaser.Math.RND.between(0, 3); // row 2 (bottom)

		// should now show the fixed goal pattern
		if (fix == true) {
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
				sqrs[y][x].setFrame("game3_"+str);
				sqrs[y][x].visible = true;
			};
		};
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
		
		this._arrow.visible = false;

		// wait 500ms for next test
		this.waitevent = this.time.addEvent({ delay: 500, callback: this.onShowSquares, callbackScope: this});
    },

    onShowSquares: function() {

		// repeat demo counter
		this._repeatdemo = (this._repeatdemo + 1) % 8; // 0..7

		// show goal on 0,2,4,5 for clarity, don't show goal pattern randomly because chance of long time no goal pattern
		var test = [0,2,4,5].indexOf(this._repeatdemo);
		var dogoal = ([0,2,4,5].indexOf(this._repeatdemo) >= 0 ? Phaser.Math.RND.between(0, 3) : -1);
		
		// !! TESTING !!
		this.game_similar_txt = (dogoal < 3 ? (dogoal < 2 ? (dogoal < 1 ? (dogoal < 0 ? "no" : "left-top") : "right-top") : "left-bottom") : "right-bottom");
		//this.debugTextGame3("");
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

		// animate hand to correct key
		var spr = (dogoal >= 0 ? this._hand1 : this._hand2);
		
		// animate hand pressing button
		var timeline1 = this.tweens.timeline(
			{
				targets: spr,
				tweens: [
					{ y: GAME_HEIGHT_CENTER+170, ease: 'Sine.easeInOut', duration: 100,  delay: 2000 },
					{ y: GAME_HEIGHT_CENTER+200, ease: 'Sine.easeInOut', duration: 300,  delay: 200 }
				],
				onComplete: this.doStartNext,
				callbackScope: this
			}
		);

		// show arrow pointing to target pattern
		if (dogoal >= 0) {
			// show arrow
			this._arrow.x = (dogoal % 2 == 0 ? GAME_WIDTH_CENTER-160 : GAME_WIDTH_CENTER+160);       // left or right side
			this._arrow.y = (dogoal < 2      ? GAME_HEIGHT_CENTER-80 : GAME_HEIGHT_CENTER+80) + 40; // top or bottom
			if ( (dogoal == 0) || (dogoal == 2) ) {
				this._arrow.setScale(-1.0, 1.0); // flip left side
			} else {
				this._arrow.setScale(1.0, 1.0); // don't flip right side
			};

			// wait short period before showing arrow
			var timeline2 = this.time.addEvent({ delay: 1500, callback: this.showArrow3, callbackScope: this});
		};
	},

	showArrow3: function()
    {
		this._arrow.visible = true;
	},

	doNext1: function()
    {
        console.log("tutorial 3 doNext1 was called!");
		// move screens
		this.moveScene(this._cntTutor1, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor2, MENU_ENTER_RIGHT);

		this.doStartNext();
    },
	
	doNext2: function()
    {
        console.log("tutorial 3 doNext2 was called!");
		// move screens
		this.moveScene(this._cntTutor2, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor3, MENU_ENTER_RIGHT);
    },

    doStart: function()
    {
        console.log("tutorial 3 doStart was called!");
		
		this.scene.start("pkugame3");
    },
	
	moveScene: function(cntScene, iMoveCode, xOffset) {
		// xOffset is optional
		if (typeof xOffset === "undefined") xOffset = 0;
		// set move values
		var width = this.game.config.width;
		var xStart = -1 * width;
		var xGoal = 0;
		//if (iMoveCode == MENU_ENTER_LEFT)  {xStart = -1 * this.width; xGoal =    0};
		if (iMoveCode == MENU_ENTER_RIGHT) {xStart = width;  xGoal = 0};
		if (iMoveCode == MENU_EXIT_LEFT)   {xStart = 0;      xGoal = -1* width};
		if (iMoveCode == MENU_EXIT_RIGHT)  {xStart = 0;      xGoal = width};
		// optionally correct for offset
		var xStart = xStart + xOffset;
		var xGoal = xGoal + xOffset;

		// set tween animation values
		cntScene.visible = true;
		cntScene.x = xStart;
		
		// slide container with menu text and buttons
		var tw = this.tweens.add(
			{
				targets: cntScene,
				x: xGoal,
				ease: "Power3",
				duration: 400, // duration of animation; higher=slower
				onComplete: this.onMoveSceneComplete.bind(this)
			}
		);
	},

	onMoveSceneComplete: function(tw, ary) {
		// make container invisible

		// not visible if container is exit to left (x = -480) or to right (x = 480)
		var cnt = ary[0];
		cnt.visible = (cnt.x == 0);
	},


});
