// Phaser3 PKU test webgame
// break-bumper, question between practise and real test

// break-bumper scene
var Bumper = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PKUgame1()
    {
        Phaser.Scene.call(this, { key: "bumper" });
    },

    preload: function()
    {

    },
	
    init: function(data)
    {
		// which level
		this._timeout = (typeof data.timeout !== "undefined" ? data.timeout : false);

		// count time outs
		if (this._timeout) {
			globalvar.timeoutcount++;
		};
    },

    create: function()
    {
		// --- static message ---
		var str = "Klaar voor de echte test?";
		var timeoutquit = false;

		// timeout afhandelen
		if (this._timeout) {
			if (globalvar.timeoutcount > MAX_TIMEOUTS) {
				// te veel timeouts, test nu afbreken
				str = "Je hebt lange tijd nergens op gedrukt voor een tweede keer.\nDe test wordt nu afgebroken.\n\nNeem contact op met de onderzoekers als je problemen ondervindt\nbij het uitvoeren van deze tests.";
				timeoutquit = true;
			} else {
				// één timeout is toegestaan, aanmoedigen en nogmaals
				str = "Je hebt lange tijd nergens op gedrukt.\nSpeel geconcentreerd en blijf goed opletten.\n\n" + str;
			};
		};
		var txt = this.add.bitmapText(60, 60, "fontwhite", str, 24);

		debugger;

		// not quitting because of timeout
		if (!timeoutquit) {
			// practise or real game
			this.btnoefen = this.addButtonText(GAME_WIDTH_CENTER-240, GAME_HEIGHT_CENTER, "sprites", this.doPractise,  this, "button2",     "button1",     "button2",     "button1", "NOG 1 KEER\nOEFENEN");
			this.btnecht  = this.addButtonText(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER, "sprites", this.doRealGame,  this, "button2",     "button1",     "button2",     "button1", "ECHTE TEST");
		};

		console.log("create is ready");
    },

    //update: function(time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function()
    //{
	//	// test debug text
    //},

	doPractise: function()
    {
        console.log("Bumper, oefenen -> start pkugame" + globalvar.game);
		// game 1, 2, 3 game, practise
		globalvar.practise = true;
		this.scene.start("pkugame" + globalvar.game);
    },

	doRealGame: function()
    {
        console.log("Bumper, real game -> start pkugame" + globalvar.game);
		// game 1, 2, 3 game, for real
		globalvar.practise = false;
		this.scene.start("pkugame" + globalvar.game);
    }
});
