// Phaser3 PKU test webgame
// mein menu scene

var MENU_ENTER_LEFT  = 1;
var MENU_ENTER_RIGHT = 2;
var MENU_EXIT_LEFT   = 3;
var MENU_EXIT_RIGHT  = 4;

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu()
    {
        Phaser.Scene.call(this, { key: "mainmenu" });
    },

    preload: function()
    {
    },

    create: function()
    {
		// add logo
		//this.sys.config.backgroundColor = "#f3cca3";
        //var logo = this.add.sprite(GAME_WIDTH_CENTER, 128, "sprites", "logo");
        var logo_send = this.add.sprite(GAME_WIDTH_CENTER, 60, "sprites", "pkulogo");

		// --- start message ---
		this._cntWelcome  = this.add.container();
		var txttut1 = this.add.bitmapText(60, 120, "fontwhite", "Welkom,\nWe vragen jou 4 korte computer testen in te vullen, zodat de dokter kan zien\nhoe het met je gaat als je straks naar de poli komt.\n\nHet is belangrijk dat je op dit moment in een rustige kamer zit\nwaar je niet gestoord kunt worden.\nJe kunt namelijk alleen tussen de testjes door even stoppen.\n\nHet maken van de testjes duurt ongeveer 30 minuten.\n\nProbeer de testjes zo snel maar vooral ook zo goed mogelijk te doen.\n\nAls je er klaar voor bent om te beginnen, mag je op de rode startknop drukken. ", 24);
		
		this.btnstart = this.addButtonText(GAME_WIDTH_CENTER,     GAME_HEIGHT-120, "sprites", this.doStart,  this, "button2",     "button1",     "button2",     "button1",  "START");

		// add all to container
		this._cntWelcome.add(txttut1);
		this._cntWelcome.add(this.btnstart);

		// --- dominante hand ---
		this._cntDominant = this.add.container();

		var txtdom1 = this.add.bitmapText(GAME_WIDTH_CENTER, 120, "fontwhite", "Ben je links of rechtshandig?", 24);
		var txtdom2 = this.add.bitmapText(GAME_WIDTH_CENTER, 120+40, "fontwhite", "De hand waarmee jij schrijf is je DOMINANTE hand", 24);

		txtdom1.setOrigin(0.5).setCenterAlign();
		txtdom2.setOrigin(0.5).setCenterAlign();

		//this.btnhand1 = this.addButtonText(GAME_WIDTH_CENTER-240, GAME_HEIGHT_CENTER, "sprites", this.doHand1,  this, "button2",     "button1",     "button2",     "button1", "Links");
		//this.btnhand2 = this.addButtonText(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER, "sprites", this.doHand2,  this, "button2",     "button1",     "button2",     "button1", "Rechts");
		//this.btnhand1.setOrigin(0.5); // .setCenterAlign();
		//this.btnhand2.setOrigin(0.5); // .setCenterAlign();
		
		this.btnhand1  =  this.addButtonText(GAME_WIDTH_CENTER-240, GAME_HEIGHT_CENTER, "sprites", this.doHand1,  this, "button_sq2",     "button_sq1",     "button_sq2",     "button_sq1", "");
		this.btnhand2  =  this.addButtonText(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER, "sprites", this.doHand2,  this, "button_sq2",     "button_sq1",     "button_sq2",     "button_sq1", "");
		this.sprhand1  =     this.add.sprite(GAME_WIDTH_CENTER-240, GAME_HEIGHT_CENTER, "sprites", "hand_choose");
		this.sprhand2  =     this.add.sprite(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER, "sprites", "hand_choose");
		this.sprhandsel=     this.add.sprite(                    0, GAME_HEIGHT_CENTER+192, "sprites", "icon_yes" );
		this.txthand1  = this.add.bitmapText(GAME_WIDTH_CENTER-240, GAME_HEIGHT_CENTER+140, "fontwhite", "Links", 24);
		this.txthand2  = this.add.bitmapText(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER+140, "fontwhite", "Rechts", 24);

		this.sprhand2.setScale(-1.0, 1.0); // flip left hand

		this.sprhand1.setAlpha(0.5);
		this.sprhand2.setAlpha(0.5);
		this.sprhandsel.setVisible(false);

		this.txthand1.setOrigin(0.5).setCenterAlign();
		this.txthand2.setOrigin(0.5).setCenterAlign();

		this.btnhandok = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER+240, "sprites", this.doHandOk,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "Ok");

		this._cntDominant.add(txtdom1);
		this._cntDominant.add(txtdom2);
		this._cntDominant.add(this.btnhand1);
		this._cntDominant.add(this.btnhand2);
		this._cntDominant.add(this.sprhand1);
		this._cntDominant.add(this.sprhand2);
		this._cntDominant.add(this.sprhandsel);
		this._cntDominant.add(this.txthand1);
		this._cntDominant.add(this.txthand2);
		this._cntDominant.add(this.btnhandok);

		this._handtween = null;

		// --- keyboard uitleg ---
		this._cntKeyboard = this.add.container();

		var txtkey1 = this.add.bitmapText(GAME_WIDTH_CENTER, 140, "fontwhite", "Voor de verschillende tests zul je je linker- en rechterhand gebruiken.\nGebruik voor je linkerhand altijd de Z toets, links op het keyboard,\nen voor je rechterhand altijd de M toets, rechts op het keyboard.", 24);
		var sprkey   = this.add.sprite(GAME_WIDTH_CENTER, GAME_HEIGHT_CENTER, "sprites", "keyboard");
		var keyhand1 = this.add.sprite(GAME_WIDTH_CENTER+112, GAME_HEIGHT_CENTER+96, "sprites", "hand_point");
		var keyhand2 = this.add.sprite(GAME_WIDTH_CENTER-112, GAME_HEIGHT_CENTER+96, "sprites", "hand_point");
		
		var btnkeynext = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doGames,  this, "button_s2",     "button_s1",     "button_s2",     "button_s1", "verder");
		
		keyhand2.setScale(-1.0, 1.0); // flip left hand
		txtkey1.setOrigin(0.5).setCenterAlign();
		//keyhand2.setVisible(false);

		this._cntKeyboard.add(txtkey1);
		this._cntKeyboard.add(sprkey);
		this._cntKeyboard.add(keyhand1);
		this._cntKeyboard.add(keyhand2);
		this._cntKeyboard.add(btnkeynext);
		

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
		this._cntKeyboard.visible = false;
		this._cntGames.visible    = false;

		console.log("create is ready");
    },
	
	doStart: function()
    {
        console.log("menuscene doStart was called!");
	
		// move screens
		this.moveScene(this._cntWelcome,  MENU_EXIT_LEFT);
		this.moveScene(this._cntDominant, MENU_ENTER_RIGHT);
    },
	
	doHand1: function()
    {
        console.log("doHand1 LINK geselecteerd!");
		this.doSelectHand(CONST_LEFT);
    },

	doHand2: function()
    {
        console.log("doHand2 RECHTS geselecteerd!");
		this.doSelectHand(CONST_RIGHT);
    },
	
	doSelectHand: function(idx)
    {
        console.log("doHand2 RECHTS geselecteerd!");
		globalvar.dominant = idx;
		var spr = this.sprhand1;
		var ang = -30;
		if (idx == CONST_LEFT) {
			// left
			this.sprhand1.setAlpha(1.0);
			this.sprhand2.setAlpha(0.5);

			this.sprhandsel.x = GAME_WIDTH_CENTER-240;
			this.sprhandsel.setVisible(true);
		} else {
			// right
			this.sprhand1.setAlpha(0.5);
			this.sprhand2.setAlpha(1.0);

			this.sprhandsel.x = GAME_WIDTH_CENTER+240;
			this.sprhandsel.setVisible(true);

			spr = this.sprhand2;
			ang = 30;
		};
		
		this._handtween = this.tweens.add({
								targets: spr,
								angle: ang,
								duration: 200,
								ease: 'Sine.easeInOut',
								yoyo: true,
								repeat: 1
							});
    },

	doHandOk: function()
    {
        console.log("doHand2 RECHTS geselecteerd!");
		if (this.sprhandsel.visible == true) {
			this.updateDeelnemer();
			this.doKeyboard();
		};
    },

    doKeyboard: function()
    {
		
		// move screens
		this.moveScene(this._cntDominant, MENU_EXIT_LEFT);
		this.moveScene(this._cntKeyboard, MENU_ENTER_RIGHT);
	},
	
    doGames: function()
    {
		// move screens
		this.moveScene(this._cntKeyboard, MENU_EXIT_LEFT);
		this.moveScene(this._cntGames,    MENU_ENTER_RIGHT);
	},
	
    doGame1: function()
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
	
    doGame2: function()
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
	
    doGame3: function()
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
	
    doGame4: function()
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

	updateDeelnemer: function() {

		// build url
		var url = PKU_URL + "set_dn.php";
		
		// parameters
		var paramsdata = 
			"studynr=" + globalvar.studynr +
			"&dominant_hand=" + globalvar.dominant;
			//"&dob=" + dob;

		var request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		//request.setRequestHeader("Content-length", paramsdata.length);
		//request.setRequestHeader("Connection", "close");

		// handle success or error
		request.onreadystatechange = function(receiveddata) {
			if (request.status >= 200 && request.status < 400) {
				if (request.readyState == 4 && request.status == 200) {
					// Success!
					// here you could go to the leaderboard or restart your game
					console.log('SUCCESS!!\nrequest.status='+ request.status + '\nrequest.response=' + request.response);
					var getjson = JSON.parse(request.response);
					if (getjson.result == 'OK') {
						console.log('deelnemer updated succesfully');
						// success message
						this.successSaving();
					} else {
						console.log('deelnemer update failed');
						this.errorSaving(-1, getjson.message);
					};
				};
			} else {
				// We reached our target server, but it returned an error
				console.log('deelnemer update failed with error ' + request.status + ': ' + request.statusText);
				this.errorSaving(request.status, request.statusText);
			}
		}.bind(this); // <- only change

		//paramsdata = getUserAgentParams();
		request.send(paramsdata);
	},
	
	successSaving: function()
	{
		this._msg.text = "ok, saved";
		// happy flow, just continue
		this.doContinue();
	},
	
	errorSaving: function(sta, txt)
	{
		this._msg.text = "Resultaat " + this._gametxt + " opslaan mislukt:\n" + sta + ": " + txt + "\n\nneem contact op met de onderzoekers";
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
