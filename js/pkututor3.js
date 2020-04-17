// Phaser3 PKU test webgame
// game 3 tutorial

// tutorial game3
var Tutorial3 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Tutorial3 ()
    {
        Phaser.Scene.call(this, { key: "tutorial3" });
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
		globalvar.game = 3;
		//globalvar.game_part = 1; // game_part is updated in GameEnd scene
    },

    create: function ()
    {
		// dominante hand is JA knop
		var btn_yes = (globalvar.dominant == CONST_RIGHT ? "M" : "Z");
		var btn_no  = (globalvar.dominant == CONST_RIGHT ? "Z" : "M");

		// --- static message ---
		var txttitle1 = this.add.bitmapText(60, 60, "fontwhite", "TEST 3: PATROON HERKENNEN", 24);

		// --- tutorial message 1 ---
		this._cntTutor1 = this.add.container();
		var txt1 = this.add.bitmapText(60, 120,     "fontwhite", "Nu gaan we beginnen met test 3\nBij deze test gaat het om het herkennen van een patroon.", 24);
		var txt2 = this.add.bitmapText(60, 120+60,  "fontwhite", "Het gaat om dit patroon:\nOnthoud deze goed!", 24);
		var txt3 = this.add.bitmapText(60, 120+120, "fontwhite", "Zometeen krijg je steeds 4 patronen te zien,\nwanneer je dit patroon herkent druk je op de JA-knop (" + btn_yes + "), ", 24);
		var txt4 = this.add.bitmapText(60, 120+180, "fontwhite", "wanneer je het patroon niet herkent druk je op de NEE-knop (" + btn_no + ")", 24);
		var btn1 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doNext1,  this, "button2",     "button1",     "button2",     "button1", "Volgende");

		// add all to container
		this._cntTutor1.add(txt1);
		this._cntTutor1.add(txt2);
		this._cntTutor1.add(txt3);
		this._cntTutor1.add(txt4);
		this._cntTutor1.add(btn1);

		// --- tutorial message 2 ---
		this._cntTutor2 = this.add.container();

		var txt4 = this.add.bitmapText(60, 120,     "fontwhite", ("Deel" + globalvar.game_part + ":"), 24);
		var txt5 = this.add.bitmapText(60, 120+60,  "fontwhite", "Het gaat om dit patroon:\nOnthoud deze goed !", 24);
		var txt6 = this.add.bitmapText(60, 120+120, "fontwhite", "Dit gaan we eerst even oefenen.", 24);
		var btn2 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1", "Oefenen");

		this._cntTutor2.add(txt4);
		this._cntTutor2.add(txt5);
		this._cntTutor2.add(txt6);
		this._cntTutor2.add(btn2);

		// only main menu visible
		//this._cntTutor1.visible = false;
		this._cntTutor2.visible = false;

		console.log("Tutorial3 create is ready");
    },

    //update: function (time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function ()
    //{
	//	// test debug text
    //},
	
	doNext1: function ()
    {
        console.log("tutorial 3 doNext1 was called!");
		// move screens
		this.moveScene(this._cntTutor1, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor2, MENU_ENTER_RIGHT);
    },

    doStart: function ()
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
