// Phaser3 PKU test webgame
// study number login

// very first first screen
var LoginScreen = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoginScreen()
    {
        Phaser.Scene.call(this, { key: "loginscreen" });
    },

    preload: function()
    {

    },
	
    init: function(data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);
    },

    create: function()
    {
		// --- static message ---
		var txttitle1 = this.add.bitmapText(60, 60, "fontwhite", "Login screen", 24);
		var txt1 = this.add.bitmapText(60, 120, "fontwhite", "Geef hieronder je studienummer op om te beginnen.", 24);
		
		createRectangle(this, 360, 192, 224, 64, 0x000040, 1.0);
	
		//this._txtstudynr = this.add.bitmapText(320, 160, "fontwhite", "", 24);
		this._txtstudynr = this.add.text(360+64, 192+16, "", { font: "32px Arial Black", fill: "#ffffff" });
		this._strstudynr = "";
		
		// key buttons
		this._cntButtons = this.add.container();
		for (var i=0; i < 12; i++) {
			// grid buttons
			var r = Math.floor(i / 3);
			var xpos = GAME_WIDTH_CENTER + (((i % 3)-1) * 80);
			var ypos = 320 + (r * 80);
			var str = ""+(i+1);

			// exception for "0"
			if (i >= 9) {
				//xpos = xpos + 80;
				str = (i < 11 ? (i < 10 ? "<<" : "0") : "ok");
			};

			// add button sprite
			var btn = this.addButtonText(xpos, ypos, "sprites", this.doDigit, this, "btn_round1", "btn_round0", "btn_round1", "btn_round0", str);
			this._cntButtons.add(btn);
		};

		
		// key input handler
		this.input.keyboard.on('keydown', this.doLoginKeyDown, this);
		//this.input.keyboard.on('keyup',   this.doLoginKeyUp, this);

		console.log("LoginScreen create is ready");
    },

    //update: function(time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function()
    //{
	//	// test debug text
    //},
	
    doDigit: function(cnt)
    {
		// get button label text
		var lbl = cnt.textdata;
		var cod = (lbl == "<<" ? -1 : (lbl == "ok" ? 99 : lbl));
		this.doLoginInput(cod);
    },
	
    doLoginKeyDown: function(evt) {
		console.log('doKeyDown -- evt.keyCode=' + evt.keyCode);
		
		var i = -99;
		// press number 0..9 (asc 48..57)
		if ( (evt.keyCode >= 48) &&  (evt.keyCode <= 57) ) {
			i = evt.keyCode - 48;
		};
		
		// press numberpad 0..9 (asc 96..105)
		if ( (evt.keyCode >= 96) &&  (evt.keyCode <= 105) ) {
			i = evt.keyCode - 96;
		};

		// backspace
		if (evt.keyCode == 8) {
			i = -1;
		};

		// update inlog code
		if (i >= -1) {
			this.doLoginInput(i);
		};

		// enter/return
		if (evt.keyCode == 13) {
			this.doLoginInput(99);
			//if (this._strstudynr.length == 5) {
			//	this.doStart();
			//};
		};
	},
	
    doLoginInput: function(dig) {
		console.log("doLoginInput dig=" + dig);

		// update input string
		if ( (dig >= 0) && (dig <= 9) ) {
			// add digit, max 5 characters
			if (this._strstudynr.length < 5) {
				this._strstudynr += dig;
			};
		} else if (dig < 0) {
			// backspace, remove last
			this._strstudynr = this._strstudynr.substring(0, this._strstudynr.length - 1);
		} else {
			if (this._strstudynr.length == 5) {
				this.getDeelnemer();
			};
		};

		// update on screen
		this._txtstudynr.text = this._strstudynr;
	},
	
	getDeelnemer: function() {

		// build url
		var url = PKU_URL + "get_dn.php?studynr=" + this._strstudynr;

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', url, true);
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		//xmlHttp.setRequestHeader("Content-length", paramsdata.length);
		//xmlHttp.setRequestHeader("Connection", "close");

		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
					this.startDeelnemer(xmlHttp.responseText);
			} else {
				// We reached our target server, but it returned an error
				console.log('Legacy get failed with error ' + xmlHttp.status + ': ' + xmlHttp.statusText);
				this.errorDeelnemer(xmlHttp.status, xmlHttp.statusText);
			}	
		}.bind(this); // <- only change

		xmlHttp.send(null);
	},
	
    errorDeelnemer: function(sta, txt)
    {
		// clear code
		this._strstudynr = "";
		this._txtstudynr.text = "";

		// shake if error
		var timeline = this.tweens.createTimeline();
		timeline.add({targets: this._cntButtons, x: 0+8,  ease: 'Power1', duration: 40});
		timeline.add({targets: this._cntButtons, x: 0-8,  ease: 'Power1', duration: 40});
		timeline.add({targets: this._cntButtons, x: 0+6,  ease: 'Power1', duration: 40});
		timeline.add({targets: this._cntButtons, x: 0-6,  ease: 'Power1', duration: 40});
		timeline.add({targets: this._cntButtons, x: 0+4,  ease: 'Power1', duration: 40});
		timeline.add({targets: this._cntButtons, x: 0-4,  ease: 'Power1', duration: 40});
		timeline.add({targets: this._cntButtons, x: 0+2,  ease: 'Power1', duration: 40});
		timeline.add({targets: this._cntButtons, x: 0-2,  ease: 'Power1', duration: 40});
		timeline.add({targets: this._cntButtons, x: 0,    ease: 'Power1', duration: 40});
		timeline.play();
	},

    startDeelnemer: function(data)
    {
		try {
			gameparts = JSON.parse(data);
		} catch (e) {
			gameparts = [{"game": -1, "part": -1}]; //error in the above string(in this case,yes)!
		};
        console.log("startDeelnemer was called!");

		// save participant code
		if (gameparts[0].game == -1) {
			// not a valid deelnemer
			this.errorDeelnemer(-1, "Ongeldig deelnemer nummer");
		} else {
			// valid new deelnemer
			globalvar.studynr = this._strstudynr;

			if (gameparts[0].game == 0) {
				// new deelnemer
				this.scene.start("mainmenu");
			} else {
				// continue game at last part
				this.scene.start("gamesave");
			};
		}
    }
});
