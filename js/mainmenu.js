// Phaser3 PKU test webgame
// mein menu scene

var MENU_ENTER_LEFT  = 1;
var MENU_ENTER_RIGHT = 2;
var MENU_EXIT_LEFT   = 3;
var MENU_EXIT_RIGHT  = 4;

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: "mainmenu" });
    },

    preload: function ()
    {
    },

    create: function ()
    {

		// add logo
		//this.sys.config.backgroundColor = "#f3cca3";
        //var logo = this.add.sprite(GAME_WIDTH_CENTER, 128, "sprites", "logo");
        var logo_send = this.add.sprite(GAME_WIDTH_CENTER, 60, "sprites", "pkulogo");

		// --- start message ---
		this._cntWelcome  = this.add.container();
		var txttut1 = this.add.bitmapText(60, 120, "fontwhite", "Welkom,\nWe vragen jou 4 korte computer testen in te vullen, zodat de dokter kan zien hoe het met je gaat\nals je straks naar de poli komt.\n\nHet is belangrijk dat je op dit moment in een rustige kamer zit waar je niet gestoord kunt worden. Je kunt namelijk alleen tussen de testjes door even stoppen.\n\nHet maken van de testjes duurt ongeveer 30 minuten.\n\nProbeer de testjes zo snel maar vooral ook zo goed mogelijk te doen.\n\nAls je er klaar voor bent om te beginnen, mag je op de rode startknop drukken. ", 24);
		
		this.btnstart = this.addButtonText(GAME_WIDTH_CENTER,     GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1",  "test123");

		// add all to container
		this._cntWelcome.add(txttut1);
		this._cntWelcome.add(this.btnstart);

		// --- dominante hand ---
		this._cntDominant = this.add.container();
		// see online encoding tool -> https://encoder.internetwache.org/
		var txtdom1 = this.add.bitmapText(GAME_WIDTH_CENTER, 160, "fontwhite", "Ben je links of rechtshandig?", 24);
		var txtdom2 = this.add.bitmapText(GAME_WIDTH_CENTER, GAME_HEIGHT-160, "fontwhite", "De hand waarmee jij schrijf is je DOMINANTE hand", 24);

		txtdom1.setOrigin(0.5).setCenterAlign();
		txtdom2.setOrigin(0.5).setCenterAlign();

		this.btnhand1 = this.addButtonText(GAME_WIDTH_CENTER-240, GAME_HEIGHT_CENTER, "sprites", this.doHand1,  this, "button2",     "button1",     "button2",     "button1", "Links");
		this.btnhand2 = this.addButtonText(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER, "sprites", this.doHand2,  this, "button2",     "button1",     "button2",     "button1", "Rechts");
		//this.btnhand1.setOrigin(0.5); // .setCenterAlign();
		//this.btnhand2.setOrigin(0.5); // .setCenterAlign();

		this._cntDominant.add(txtdom1);
		this._cntDominant.add(txtdom2);
		this._cntDominant.add(this.btnhand1);
		this._cntDominant.add(this.btnhand2);

		// --- select a game ---
		this._cntGames = this.add.container();
		var txtgames   = this.add.bitmapText(GAME_WIDTH_CENTER, 160, "fontwhite", "Selecteer een game", 24);
		var btngame1   = this.addButtonText(GAME_WIDTH_CENTER-220, 60+GAME_HEIGHT_CENTER-90, "sprites", this.doGame1, this, "button2", "button1", "button2", "button1", "Game 1 bs");
		var btngame2   = this.addButtonText(GAME_WIDTH_CENTER+220, 60+GAME_HEIGHT_CENTER-90, "sprites", this.doGame2, this, "button2", "button1", "button2", "button1", "Game 2 ssv");
		var btngame3   = this.addButtonText(GAME_WIDTH_CENTER-220, 60+GAME_HEIGHT_CENTER+90, "sprites", this.doGame3, this, "button2", "button1", "button2", "button1", "Game 3 fi");
		var btngame4   = this.addButtonText(GAME_WIDTH_CENTER+220, 60+GAME_HEIGHT_CENTER+90, "sprites", this.doGame4, this, "button2", "button1", "button2", "button1", "Game 4 ife");
		
		txtgames.setOrigin(0.5).setCenterAlign();

		this._cntGames.add(txtgames);
		this._cntGames.add(btngame1);
		this._cntGames.add(btngame2);
		this._cntGames.add(btngame3);
		this._cntGames.add(btngame4);

		// only main menu visible
		//this._cntWelcome.visible = false;
		this._cntDominant.visible = false;
		this._cntGames.visible    = false;

		console.log("create is ready");
    },
	
	doStart: function ()
    {
        console.log("menuscene doStart was called!");
	
		// move screens
		this.moveScene(this._cntWelcome,  MENU_EXIT_LEFT);
		this.moveScene(this._cntDominant, MENU_ENTER_RIGHT);
    },
	
	doHand1: function ()
    {
        console.log("doHand1 LINK geselecteerd!");
		globalvar.dominant = CONST_LEFT;
		this.doGames();
    },

	doHand2: function ()
    {
        console.log("doHand2 RECHTS geselecteerd!");
		globalvar.dominant = CONST_RIGHT;
		this.doGames();
    },

    doGames: function ()
    {
		// move screens
		this.moveScene(this._cntDominant, MENU_EXIT_LEFT);
		this.moveScene(this._cntGames,    MENU_ENTER_RIGHT);
	},
	
    doGame1: function ()
    {
		// move screens
        console.log(" -- TODO start game 1");

		// set global variables
		globalvar.practise = true;
		globalvar.game = 1;
		globalvar.game_part = 1;

		// start scene
		this.scene.start('tutorial1');
	},
	
    doGame2: function ()
    {
		// move screens
        console.log(" -- TODO start game 2");
		
		// set global variables
		globalvar.practise = true;
		globalvar.game = 2;
		globalvar.game_part = 1;

		// start scene
		this.scene.start('tutorial2');
	},
	
    doGame3: function ()
    {
		// move screens
        console.log(" -- TODO start game 3");
		
		// set global variables
		globalvar.practise = true;
		globalvar.game = 3;
		globalvar.game_part = 1;

		// start scene
		this.scene.start('tutorial3');
	},
	
    doGame4: function ()
    {
		// move screens
        console.log(" -- TODO start game 4");
		
		// set global variables
		globalvar.practise = true;
		globalvar.game = 4;
		globalvar.game_part = 1;

		// start scene
		this.scene.start('tutorial4');
	},

    doReset: function ()
    {
        console.log("doReset was called!");

		// play gui sound effect
		this._sfxforward.play();
		
		// move screens
		this.moveScene(this._cntGames,   MENU_ENTER_RIGHT);
		this.moveScene(this._cntWelcome, MENU_EXIT_LEFT);
    },
	
    doTrophy: function ()
    {
        console.log("doTrophy was called!");

		// play gui sound effect
		this._sfxforward.play();
		
		this.scene.start("trophies");
    },
	
	doResetYes: function ()
    {
		
		this._countreset++;

		// play gui sound effect
		this._sfxforward.play();
		
		var str = "Gone";
		if (this._countreset < 3) {
			var str = (this._countreset == 1 ? "Going" : "Going, going");
		};
		
		this._txtreset.text = str
		
		if (this._countreset == 3) {
			// clear local storage
			window.localStorage.removeItem("sendintheclones_highscore");
			window.localStorage.removeItem("sendintheclones_trophies");
			
			// reset trophy array
			for (var i=0; i < AllTrophies.length; i++) {
				AllTrophies[i].status = 0;
			};
		
			console.log("local storage was cleared");
		};
    },

	
    doCredits: function ()
    {
        console.log("doCredits was called!");
		
		// play gui sound effect
		this._sfxforward.play();

		// play sound effect
		//impsnake2.soundeffect_play(this.soundButton);

		// move screens
		this.moveScene(this._cntDominant, MENU_ENTER_LEFT);
		this.moveScene(this._cntWelcome,    MENU_EXIT_RIGHT);
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

	doBack: function(btn, ptr, b) {

		// play sound effect, except when called by doResetYes
		if (typeof btn !== "undefined") {
			//impsnake2.soundeffect_play(this.soundBack);
		}

		// play gui sound effect
		this._sfxback.play();

		if (this._cntDominant.visible == true) {
			// at credits game screen, go back to options
			this.moveScene(this._cntWelcome,    MENU_ENTER_RIGHT);
			this.moveScene(this._cntDominant, MENU_EXIT_LEFT);
			this._menuindex = 1;
			return false;
		} else if (this._cntGames.visible == true) {
			// at reset game screen, go back to mainmenu
			this.moveScene(this._cntWelcome,  MENU_ENTER_RIGHT);
			this.moveScene(this._cntGames, MENU_EXIT_LEFT);
			this._menuindex = 1;
			return false;
		} else {
			return true;
		};
	},

});
