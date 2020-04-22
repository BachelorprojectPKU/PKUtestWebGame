// Phaser3 PKU test webgame
// study number login

// very first first screen
var LoginScreen = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoginScreen ()
    {
        Phaser.Scene.call(this, { key: "loginscreen" });
    },

    preload: function ()
    {

    },
	
    init: function (data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);
    },

    create: function ()
    {
		// --- static message ---
		var txttitle1 = this.add.bitmapText(60, 60, "fontwhite", "Login screen", 24);
		var txt1 = this.add.bitmapText(60, 120,     "fontwhite", "Geef hieronder je studienummer op om in te loggen.", 24);
		
		this._txtstudynr = this.add.bitmapText(60, 120+120, "fontwhite", "---", 24);
		this._strstudynr = "";
		
		// key input handler
		this.input.keyboard.on('keydown', this.doLoginKeyDown, this);
		//this.input.keyboard.on('keyup',   this.doLoginKeyUp, this);

		console.log("LoginScreen create is ready");
    },

    //update: function (time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function ()
    //{
	//	// test debug text
    //},
	
    doLoginKeyDown: function (evt) {
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
			if (this._strstudynr.length == 5) {
				this.doStart();
			};
		};
	},
	
    doLoginInput: function (dig) {
		console.log("doLoginInput dig=" + dig);

		// update input string
		if (dig >= 0) {
			// add digit, max 5 characters
			if (this._strstudynr.length < 5) {
				this._strstudynr += dig;
			};
		} else {
			// backspace, remove last
			this._strstudynr = this._strstudynr.substring(0, this._strstudynr.length - 1);
		};

		// update on screen
		this._txtstudynr.text = this._strstudynr;
	},

    doStart: function ()
    {
        console.log("Login doStart was called!");

		// save participant code
		globalvar.studynr = this._strstudynr;
				
		this.scene.start("mainmenu");
    }
});
