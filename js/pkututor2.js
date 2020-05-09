// Phaser3 PKU test webgame
// game 2 tutorial

// tutorial game2
var Tutorial2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Tutorial2()
    {
        Phaser.Scene.call(this, { key: "tutorial2" });
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
		globalvar.game = 2;
		//globalvar.game_part = 1; // game_part is updated in GameEnd scene
    },

    create: function()
    {
		// banner at top of screen
		var recttile = createRectangle(this, 0, 30, 960, 60, 0x0000ff, 1.0);
		var txttitle1 = this.add.bitmapText(60, 40, "fontwhite", "TEST 2: VERSPRINGENDE AANDACHT", 24);

		// --- tutorial message 1 ---
		this._cntTutor1 = this.add.container();
		var txt1 = this.add.bitmapText(60, 120,     "fontwhite", "Nu gaan we beginnen met test 2. Deze test bestaat uit 3 delen.\nHier gaan we kijken hoe goed jij je aandacht bij een spel kan houden.", 24);
		var txt2 = this.add.bitmapText(60, 120+60,  "fontwhite", "In deze test zie je een balk die bestaat uit 10 blokjes.\n1 van deze blokjes is gekleurd en springt willekeurig naar links of rechts.", 24);
		var txt3 = this.add.bitmapText(60, 120+120, "fontwhite", "We maken hierbij gebruik van de LINKS (Z) en de RECHTS (M) knop.", 24);
		var btn1 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext1,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "Verder");

		// add all to container
		this._cntTutor1.add(txt1);
		this._cntTutor1.add(txt2);
		this._cntTutor1.add(txt3);
		this._cntTutor1.add(btn1);

		// --- tutorial message 2 ---
		this._cntTutor2 = this.add.container();
		var txt4 = this.add.bitmapText(60, 120,     "fontwhite", ("Deel" + globalvar.game_part + ":"), 24);
		var txt5 = this.add.bitmapText(60, 120+60,  "fontwhite", "In deze test zie je een balk die bestaat uit 10 blokjes. 1 van deze blokjes\nis GROEN gekleurd en springt willekeurig naar links of rechts.", 24);
		var txt6 = this.add.bitmapText(60, 120+120, "fontwhite", "Het is de bedoeling dat je het blokje volgt: Springt het blokje naar links,\ndan druk jij op de LINKS knop (Z).", 24);
		var txt7 = this.add.bitmapText(60, 120+180, "fontwhite", "Springt het blokje naar rechts, dan druk je op de RECHTS knop (M).", 24);
		var btn2 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext2,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "Verder");

		this._cntTutor2.add(txt4);
		this._cntTutor2.add(txt5);
		this._cntTutor2.add(txt6);
		this._cntTutor2.add(txt7);
		this._cntTutor2.add(btn2);
		
		// --- tutorial message 3 ---
		this._cntTutor3 = this.add.container();
		
		var str = "Het is de bedoeling dat je het blokje volgt:\nSpringt het blokje naar links, dan druk jij op de LINKS knop (Z).\nSpringt het blokje naar rechts, dan druk je op de RECHTS knop (M).";
		var txt8 = this.add.bitmapText(60, 120,     "fontwhite", str, 24);
		var btn3 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext3,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "Verder");
		
		this._cntTutor3.add(txt8);
		this._cntTutor3.add(btn3);

		this.squares = [];
		for (var i=0; i < 10; i++) {
			// squares are 80x80px, width=960px
			var x = 80 + ((80 + 8) * i);
			var block = this.add.sprite(x, GAME_HEIGHT_CENTER, "sprites", "block2_0");
			this._cntTutor3.add(block);
			this.squares[i] = block;
		};
		this.square_pos = 5;
		this.square_col = 0; // 0=green, 1=red
		this.square_dir = 0;
		
		this._key_1 = this.add.sprite(GAME_WIDTH_CENTER-260, GAME_HEIGHT_CENTER+120,  "sprites", "key_z");
		this._key_2 = this.add.sprite(GAME_WIDTH_CENTER+260, GAME_HEIGHT_CENTER+120,  "sprites", "key_m");
		this._hand1  = this.add.sprite(GAME_WIDTH_CENTER-260, GAME_HEIGHT_CENTER+200, "sprites", "hand_point");
		this._hand2  = this.add.sprite(GAME_WIDTH_CENTER+260, GAME_HEIGHT_CENTER+200, "sprites", "hand_point");
		
		this._hand1.setScale(-1.0, 1.0); // left hand

		this._cntTutor3.add(this._key_1);
		this._cntTutor3.add(this._key_2);
		this._cntTutor3.add(this._hand1);
		this._cntTutor3.add(this._hand2);
		
		// --- tutorial message 4 ---
		this._cntTutor4 = this.add.container();
		var txt9 = this.add.bitmapText(60, 120,      "fontwhite", "Nu gaan we beginnen met deel 1 van de test. Hier gaan we kijken hoe goed\njij je aandacht bij een spel kan houden.", 24);
		var txt10 = this.add.bitmapText(60, 120+60,  "fontwhite", "In deze test zie je een balk die bestaat uit 10 blokjes. 1 van deze blokjes\nis GROEN gekleurd en springt willekeurig naar links of rechts. ", 24);
		var txt11 = this.add.bitmapText(60, 120+120, "fontwhite", "Het is de bedoeling dat je het blokje volgt.\nKlik alleen als het blokje ook echt verspringt\nen niet als je denkt dat hij gaat verplaatsen. ", 24);
		var txt12 = this.add.bitmapText(60, 120+240, "fontwhite", "Probeer het zo snel en goed mogelijk te doen.\nDit gaan we eerst even oefenen.", 24);
		var btn4 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1", "Oefenen");

		this._cntTutor4.add(txt9);
		this._cntTutor4.add(txt10);
		this._cntTutor4.add(txt11);
		this._cntTutor4.add(txt12);
		this._cntTutor4.add(btn4);

		// only main menu visible
		//this._cntTutor1.visible = false;
		this._cntTutor2.visible = false;
		this._cntTutor3.visible = false;
		this._cntTutor4.visible = false;


		console.log("Tutorial2 create is ready");
    },

    //update: function(time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function()
    //{
	//	// test debug text
    //},
	
    doStartSquare: function() {
		// determine next color
		if (globalvar.game_part < 3) {
			this.square_col = globalvar.game_part - 1; // part1=green, part2=red
		} else {
			this.square_col = Phaser.Math.RND.between(0, 1); // part3=random
		};

		// show current square
		this.squares[this.square_pos].setFrame("block2_" + (this.square_col+1) );
		
		// set random timer
		//var msec = Phaser.Math.RND.between(500, 2500); // 0,5 and 2,5 seconds
		var msec = 1000; // constant timer for demo
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

		// animate hand to correct key
		var spr = (this.expect_btn == CONST_RIGHT ? this._hand2 : this._hand1)
		
		// animate hand
		var timeline1 = this.tweens.timeline(
			{
				targets: spr,
				tweens: [
					{ y: GAME_HEIGHT_CENTER+170, ease: 'Sine.easeInOut', duration: 100,  delay: 300 },
					{ y: GAME_HEIGHT_CENTER+200, ease: 'Sine.easeInOut', duration: 300,  delay: 300 }
				],
				onComplete: this.doStartSquare,
				callbackScope: this
			}
		);
	},


	doNext1: function()
    {
        console.log("tutorial 2 doNext1 was called!");
		// move screens
		this.moveScene(this._cntTutor1, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor2, MENU_ENTER_RIGHT);
    },

	doNext2: function()
    {
        console.log("tutorial 2 doNext2 was called!");

		// start animation
		this.doStartSquare();

		// move screens
		this.moveScene(this._cntTutor2, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor3, MENU_ENTER_RIGHT);
    },
	
	doNext3: function()
    {
        console.log("tutorial 2 doNext3 was called!");

		// move screens
		this.moveScene(this._cntTutor3, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor4, MENU_ENTER_RIGHT);
    },


    doStart: function()
    {
        console.log("tutorial 2 doStart was called!");
		
		this.scene.start("pkugame2");
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
