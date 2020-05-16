// Phaser3 PKU test webgame
// game 1 tutorial

// tutorial game1
var Tutorial1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Tutorial1()
    {
        Phaser.Scene.call(this, { key: "tutorial1" });
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
		globalvar.game = 1;
		//globalvar.game_part = 1; // game_part is updated in GameEnd scene
    },

    create: function()
    {
		// banner at top of screen
		var recttile = createRectangle(this, 0, 30, 960, 60, 0x0000ff, 1.0);
		var txttitle1 = this.add.bitmapText(60, 40, "fontwhite", "TEST 1: REACTIESNELHEID", 24);
		
		// assume dominant hand, except for first part
		var lr = globalvar.dominant;
		if (globalvar.game_part == 1) lr = (lr == CONST_LEFT ?  CONST_RIGHT : CONST_LEFT);

		// DEEL 1: niet-dominante hand
		var hand   = (lr == CONST_RIGHT ? "RECHTS"  : "LINKS");
		var hander = (lr == CONST_RIGHT ? "RECHTER" : "LINKER");
		var btn    = (lr == CONST_RIGHT ? "M"       : "Z");
		var btnlow = btn.toLowerCase();

		// tekst uitleg voor deel 1
		var str1 = "Nu gaan we beginnen met test 1.\nHier gaan we kijken hoe snel jij kunt reageren.\nWe beginnen met " + hand + ", leg straks je " + hander + " wijsvinger op de " + btn + "\n";
		var str2 = "Er verschijnt steeds een kruisje in het midden van het scherm,\ndeze verandert na korte tijd in een blokje."

		// DEEL 2: dominante hand
		if (globalvar.game_part == 2) {
			// tekst uitleg voor deel 2
			str1 = "Nu gaan we verder met " + hand + ", leg straks je " + hander + " wijsvinger op de " + btn + "\n";
			str2 = "Er verschijnt opnieuw een kruisje in het midden van het scherm,\ndeze verandert na korte tijd in een blokje.";
		};
		
		str2 = str2 + "\n\nDruk met je " + hander + " wijsvinger op de " + btn + "\nals je het kruisje in een blokje ziet veranderen.\nDaarna verandert het blokje weer terug in een kruisje.";

			// --- tutorial message 1 ---
			this._cntTutor1 = this.add.container();

			var txt1 = this.add.bitmapText(60, 120,     "fontwhite", str1, 24);
			
			var sprkey   = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "sprites", "keyboard");
			var keyhand1 = this.add.sprite(GAME_WIDTH_CENTER+112, GAME_HEIGHT_CENTER+96, "sprites", "hand_point");

			// flip as left hand
			if (lr == CONST_LEFT) {
				keyhand1.x = GAME_WIDTH_CENTER-112;
				keyhand1.setScale(-1.0, 1.0);
			};
		
			this.btnnext = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext1,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "verder");

			// add all to container
			this._cntTutor1.add(txt1);
			this._cntTutor1.add(sprkey);
			this._cntTutor1.add(keyhand1);
			this._cntTutor1.add(this.btnnext);

			// --- tutorial message 2 ---
			this._cntTutor2 = this.add.container();

			var txt2 = this.add.bitmapText(60, 120, "fontwhite", str2, 24);

			this._square = this.add.sprite(GAME_WIDTH_CENTER,     GAME_HEIGHT_CENTER+40,  "sprites", "game1_square");
			var _plus    = this.add.sprite(GAME_WIDTH_CENTER,     GAME_HEIGHT_CENTER+40,  "sprites", "game1_plus");
			var spr1     = this.add.sprite(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER+40,  "sprites", "key_"+btnlow);
			this._hand1  = this.add.sprite(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER+120, "sprites", "hand_point");
			
			this._square.setAlpha(0.0);
			
			// flip when left hand
			if (lr == CONST_LEFT) {
				this._hand1.setScale(-1.0, 1.0);
				spr1.x        = GAME_WIDTH_CENTER-240;
				this._hand1.x = GAME_WIDTH_CENTER-240;
			};

			this.btncont1 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doNext2,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "verder");

			this._cntTutor2.add(txt2);
			this._cntTutor2.add(this._square);
			this._cntTutor2.add(_plus);
			this._cntTutor2.add(spr1);
			this._cntTutor2.add(this._hand1);
			this._cntTutor2.add(this.btncont1);
			
			// --- tutorial message 3 ---
			this._cntTutor3 = this.add.container();

			var str = "Klik alleen als het kruisje ook echt verandert\nen niet als je denkt dat hij gaat veranderen.\n\nDit gaan we eerst even oefenen."
			var txt3 = this.add.bitmapText(GAME_WIDTH_CENTER, 240, "fontwhite", str, 24);
			//txt3.setOrigin(0.5).setCenterAlign();
			txt3.setOrigin(0.5);

			this.btncont3 = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1", "Oefenen");

			this._cntTutor3.add(txt3);
			this._cntTutor3.add(this.btncont3);

			// only main menu visible
			//this._cntTutor1.visible = false;
			this._cntTutor2.visible = false;
			this._cntTutor3.visible = false;


		console.log("Tutorial1 create is ready");
    },

    //update: function(time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function()
    //{
	//	// test debug text
    //},
	
	doNext1: function()
    {
        console.log("tutorial 1 doext1 was called!");
		// move screens
		this.moveScene(this._cntTutor1, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor2, MENU_ENTER_RIGHT);
		
		var timeline1 = this.tweens.timeline(
			{
				targets: this._hand1,
				loop: -1,
				tweens: [
					{ y: GAME_HEIGHT_CENTER+90, ease: 'Sine.easeInOut', duration: 100,  delay:  2300 },
					{ y: GAME_HEIGHT_CENTER+120, ease: 'Sine.easeInOut', duration: 300,  delay: 300 }
				]
			}
		);
			
		var timeline2 = this.tweens.timeline(
			{
				targets: this._square,
				loop: -1,
				tweens: [
					{ alpha: 1.0, ease: 'Linear', duration: 2, delay: (2000-6)},
					{ alpha: 0.0, ease: 'Linear', duration: 2, delay: 500},
					{ alpha: 0.0, ease: 'Linear', duration: 2, delay: 500}
				]
			}
		);
    },

	doNext2: function()
    {
        console.log("tutorial 1 doext1 was called!");
		// move screens
		this.moveScene(this._cntTutor2, MENU_EXIT_LEFT);
		this.moveScene(this._cntTutor3, MENU_ENTER_RIGHT);
    },


    doStart: function()
    {
        console.log("tutorial 1 doStart was called!");
		
		this.scene.start("pkugame1");
    }

});
