// Phaser3 PKU test webgame
// game 4 tutorial

// tutorial game4
var Tutorial4 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Tutorial4 ()
    {
        Phaser.Scene.call(this, { key: "tutorial4" });
    },

    preload: function ()
    {

    },
	
    init: function (data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);
		
		// set global variables
		globalvar.practise = true;
		globalvar.game = 1;
		//globalvar.game_part = 1; // game_part is updated in GameEnd scene
    },

    create: function ()
    {
		if (globalvar.game_part == 1) {
			// DEEL 1: niet dominante hand
			var hand   = (globalvar.dominant == CONST_RIGHT ? "LINKS"  : "RECHTS");
			var hander = (globalvar.dominant == CONST_RIGHT ? "LINKER" : "RECHTER");
			var btn    = (globalvar.dominant == CONST_RIGHT ? "Z"      : "M");

			// --- static message ---
			var txttitle1 = this.add.bitmapText(60, 60, "fontwhite", "TEST 1: REACTIESNELHEID", 24);
			var txt1 = this.add.bitmapText(60, 120,     "fontwhite", "Nu gaan we beginnen met test 1. Hier gaan we kijken hoe snel jij kunt reageren.", 24);
			var txt2 = this.add.bitmapText(60, 120+60,  "fontwhite", "We beginnen met " + hand + ".", 24);
			var txt3 = this.add.bitmapText(60, 120+120, "fontwhite", "Het is de bedoeling dat je met je " + hand + " wijsvinger op de " + btn + " klikt\nals je een kruisje in een blokje ziet veranderen.", 24);

			// --- tutorial message 1 ---
			this._cntTutor1 = this.add.container();
			var spr1 = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT-240, "sprites", "game4_plus");
			this.btnnext = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doNext1,  this, "button2",     "button1",     "button2",     "button1", "Klik op Z");

			// add all to container
			this._cntTutor1.add(spr1);
			this._cntTutor1.add(this.btnnext);

			// --- tutorial message 2 ---
			this._cntTutor2 = this.add.container();
			// see online encoding tool -> https://encoder.internetwache.org/
			var spr2 = this.add.sprite(GAME_WIDTH_CENTER-80, GAME_HEIGHT-240, "sprites", "game4_square");
			var txt4 = this.add.bitmapText(60, 120+180, "fontwhite", "Daarna verandert het blokje weer terug in een kruisje. ", 24);
			var spr3 = this.add.sprite(GAME_WIDTH_CENTER+80, GAME_HEIGHT-240, "sprites", "game4_plus");

			this.btncont1 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doNext2,  this, "button2",     "button1",     "button2",     "button1", "Volgende");

			this._cntTutor2.add(spr2);
			this._cntTutor2.add(txt4);
			this._cntTutor2.add(spr3);
			this._cntTutor2.add(this.btncont1);
			
			// --- tutorial message 3 ---
			this._cntTutor3 = this.add.container();
			// see online encoding tool -> https://encoder.internetwache.org/
			var txt5 = this.add.bitmapText(60, 120+180, "fontwhite", "Klik alleen als het kruisje ook echt verandert en niet als je denkt dat hij gaat veranderen.", 24);
			var txt6 = this.add.bitmapText(60, 120+240, "fontwhite", "Dit gaan we eerst even oefenen.", 24);

			this.btncont3 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1", "Oefenen");

			this._cntTutor3.add(txt5);
			this._cntTutor3.add(txt6);
			this._cntTutor3.add(this.btncont3);

			// only main menu visible
			//this._cntTutor1.visible = false;
			this._cntTutor2.visible = false;
			this._cntTutor3.visible = false;
		} else {
			// DEEL 2: dominante hand
			var hand   = (globalvar.dominant == CONST_RIGHT ? "RECHTS"  : "LINKS");
			var hander = (globalvar.dominant == CONST_RIGHT ? "RECHTER" : "LINKER");
			var btn    = (globalvar.dominant == CONST_RIGHT ? "M"       : "Z");

			// --- static message continue part 2 ---
			var txttitle1 = this.add.bitmapText(60, 60, "fontwhite", "TEST 4: REACTIESNELHEID", 24);

			var txt1 = this.add.bitmapText(60, 120,     "fontwhite", "We gaan verder met " + hand + ". ", 24);
			var txt2 = this.add.bitmapText(60, 120+60,  "fontwhite", "Het is nu de bedoeling dat je met je " + hander + " wijsvinger op de " + btn + " drukt\nals je het kruisje in een blokje ziet veranderen. ", 24);
			var txt3 = this.add.bitmapText(60, 120+120, "fontwhite", "Klik alleen als het kruisje ook echt verandert en niet als je denkt dat hij gaat veranderen. ", 24);
			var txt4 = this.add.bitmapText(60, 120+180, "fontwhite", "Dit gaan we eerst even oefenen.", 24);
			
			this.btncont4 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1", "cont4");

		};

		console.log("Tutorial4 create is ready");
    },

    //update: function (time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function ()
    //{
	//	// test debug text
    //},
	
    doKeyDown: function (evt) {
		console.log('doKeyDown -- evt.keyCode=' + evt.keyCode);
		if ( (evt.keyCode == 38) || (evt.keyCode == 87) ) this._inputstack.push(DIR_UP);	// 38 = cursor up,    87 = W
		if ( (evt.keyCode == 40) || (evt.keyCode == 83) ) this._inputstack.push(DIR_DOWN);	// 40 = cursor down,  83 = S
		if ( (evt.keyCode == 37) || (evt.keyCode == 65) ) this._inputstack.push(DIR_LEFT);	// 37 = cursor left,  65 = A
		if ( (evt.keyCode == 39) || (evt.keyCode == 68) ) this._inputstack.push(DIR_RIGHT);	// 39 = cursor right, 68 = D
	},
	
	doNext1: function ()
    {
        console.log("tutorial 4 doext1 was called!");
		// move screens
		this.moveScene(this._cntTutor1, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor2, MENU_ENTER_RIGHT);
    },

	doNext2: function ()
    {
        console.log("tutorial 4 doext1 was called!");
		// move screens
		this.moveScene(this._cntTutor2, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor3, MENU_ENTER_RIGHT);
    },


    doStart: function ()
    {
        console.log("tutorial 4 doStart was called!");
		
		this.scene.start("pkugame4");
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
