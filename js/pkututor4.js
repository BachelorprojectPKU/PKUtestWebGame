// Phaser3 PKU test webgame
// game 4 tutorial

// tutorial game4
var Tutorial4 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Tutorial4()
    {
        Phaser.Scene.call(this, { key: "tutorial4" });
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
		globalvar.game = 4;
		//globalvar.game_part = 1; // game_part is updated in GameEnd scene
    },

    create: function()
    {
		// !! TESTING !!
		globalvar.dominant = CONST_RIGHT;
		globalvar.game_part = 4;
		// !! TESTING !!
		
		// banner at top of screen
		var recttile = createRectangle(this, 0, 30, 960, 60, 0x0000ff, 1.0);
		var txttitle1 = this.add.bitmapText(60, 40, "fontwhite", "TEST 4: HERKENNEN VAN EMOTIES", 24);

		// dominante hand is JA knop
		var btn_yes = (globalvar.dominant == CONST_RIGHT ? "M" : "Z");
		var btn_no  = (globalvar.dominant == CONST_RIGHT ? "Z" : "M");

		// 4 times for different emotions
		this._emotions    = ["happy", "sad", "angry", "scared", "disgust", "surprised"];
		this._emotions_nl = ["vrolijk", "verdrietig", "boos", "bang", "afschuw", "verrast"];
		this._emotions_nlbv = ["vrolijke", "verdrietige", "boze", "bange", "verafschuwde", "verraste"]; // bijvoegelijk

		// variable textparts per emotion
		var idx     = globalvar.game_part-1; // zero based
		var face    = this._emotions[idx];
		var face_nl = this._emotions_nl[idx];
		var pers_nl = this._emotions_nlbv[idx];

		// --- tutorial message 1 ---
		this._cntTutor1 = this.add.container();
		var str = "Bij deze test gaat het om het herkennen van emoties van mensen.\nDe test bestaat uit 4 delen, waar je elke keer\neen andere emotie moet herkennen.\n\nWe beginnen met deel " + globalvar.game_part + ": " + pers_nl + " personen"
		var txt1 = this.add.bitmapText(60, 120,     "fontwhite", str, 24);

		this.btnnext1 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext1,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "verder");

		// add all to container
		this._cntTutor1.add(txt1);
		this._cntTutor1.add(this.btnnext1);
		
		// --- tutorial message 2 ---
		this._cntTutor2 = this.add.container();
		var str = "Zometeen krijg je steeds 1 gezicht te zien.\nHet is de bedoeling dat je " + pers_nl + " personen herkent, zoals deze:"
		var txt2 = this.add.bitmapText(60, 120,     "fontwhite", str, 24);

		var spr2 = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "faces" + globalvar.game_part, 1);
		this.btnnext2 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext2,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "verder");

		// add all to container
		this._cntTutor2.add(txt2);
		this._cntTutor2.add(spr2);
		this._cntTutor2.add(this.btnnext2);

		// --- tutorial message 3 animatie ---
		this._cntTutor3 = this.add.container();

		str = "Als je een " + face_nl + " persoon ziet, druk je op de JA-knop (" + btn_yes + ").\nAls het geen " + face_nl + " persoon is, druk je op de NEE-knop (" + btn_no + "). "
		var txt3 = this.add.bitmapText(60, 120,     "fontwhite", str, 24);

		this._face_demo = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "faces" + globalvar.game_part, 1);
		
		this._key_1 = this.add.sprite(GAME_WIDTH_CENTER-260, GAME_HEIGHT_CENTER+120, "sprites", "key_z");
		this._key_2 = this.add.sprite(GAME_WIDTH_CENTER+260, GAME_HEIGHT_CENTER+120, "sprites", "key_m");
		this._hand1 = this.add.sprite(GAME_WIDTH_CENTER+260, GAME_HEIGHT_CENTER+200, "sprites", "hand_point"); // dominant
		this._hand2 = this.add.sprite(GAME_WIDTH_CENTER-260, GAME_HEIGHT_CENTER+200, "sprites", "hand_point"); // niet-dominant

		// linker hand is dominant
		if (globalvar.dominant == CONST_LEFT) {
			this._hand1.x = GAME_WIDTH_CENTER-260;
			this._hand2.x = GAME_WIDTH_CENTER+260;
			this._hand1.setScale(-1.0, 1.0); // left hand
		} else {
			this._hand2.setScale(-1.0, 1.0); // left hand
		};

		this.btnnext3 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext3,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "verder");

		this._cntTutor3.add(txt3);
		this._cntTutor3.add(this._face_demo);
		this._cntTutor3.add(this._key_1);
		this._cntTutor3.add(this._key_2);
		this._cntTutor3.add(this._hand1);
		this._cntTutor3.add(this._hand2);
		this._cntTutor3.add(this.btnnext3);
		
		// --- tutorial message 4 ---
		this._cntTutor4 = this.add.container();

		str = "Het is dus de bedoeling je " + pers_nl + " personen herkent.\n\nAls je een " + face_nl + " persoon ziet, druk je op de JA-knop (" + btn_yes + ").\nAls het geen " + face_nl + " persoon is, druk je op de NEE-knop (" + btn_no + ").\n\nDit gaan we eerst even oefenen."
		var txt4 = this.add.bitmapText(60, 120, "fontwhite", str, 24);

		this.btnnext4 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1", "Oefenen");

		this._cntTutor4.add(txt4);
		this._cntTutor4.add(this.btnnext4);

		// only main menu visible
		//this._cntTutor1.visible = false;
		this._cntTutor2.visible = false;
		this._cntTutor3.visible = false;
		this._cntTutor4.visible = false;

		console.log("Tutorial4 create is ready");

		this._repeatdemo = 0;
    },

    //update: function(time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function()
    //{
	//	// test debug text
    //},

    doStartNext: function() {
		// face invisible
		this._face_demo.visible = false;

		// wait 500ms for next test
		this.waitevent = this.time.addEvent({ delay: 500, callback: this.onShowFace, callbackScope: this});
    },

    onShowFace: function() {

		// repeat demo counter
		this._repeatdemo = (this._repeatdemo + 1) % 8; // 0..7

		// show goal on 0,2,4,5 for clarity, don't show goal pattern randomly because chance of long time no goal pattern
		var test = [0,2,4,5].indexOf(this._repeatdemo);
		var dogoal = ([0,2,4,5].indexOf(this._repeatdemo) >= 0);

		// choose random emotion
		this._face_idx = Phaser.Math.RND.between(0, 5); // random emotion

		// if should now show goal emotion
		if (dogoal) {
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
		
		// make new face visible
		this._face_demo.setTexture("faces" + (this._face_idx+1));
		var frm = Phaser.Math.RND.between(0, 2); // 0..2, max 3 photos at the moment
		this._face_demo.setFrame(frm);

		this._face_demo.visible = true;

		// animate hand to correct key
		var spr = (dogoal ? this._hand1 : this._hand2);
		
		// animate hand pressing button
		var timeline1 = this.tweens.timeline(
			{
				targets: spr,
				tweens: [
					{ y: GAME_HEIGHT_CENTER+170, ease: 'Sine.easeInOut', duration: 100,  delay: 900 },
					{ y: GAME_HEIGHT_CENTER+200, ease: 'Sine.easeInOut', duration: 200,  delay: 300 }
				],
				onComplete: this.doStartNext,
				callbackScope: this
			}
		);
	},

	doNext1: function()
    {
        console.log("tutorial 4 doNext1 was called!");
		// move screens
		this.moveScene(this._cntTutor1, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor2, MENU_ENTER_RIGHT);
    },

	doNext2: function()
    {
        console.log("tutorial 4 doNext2 was called!");
		// move screens
		this.moveScene(this._cntTutor2, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor3, MENU_ENTER_RIGHT);
		
		// start animation
		this.doStartNext();
    },

	doNext3: function()
    {
        console.log("tutorial 4 doNext3 was called!");
		// move screens
		this.moveScene(this._cntTutor3, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor4, MENU_ENTER_RIGHT);
    },


    doStart: function()
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
