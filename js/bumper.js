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
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);
    },

    create: function()
    {
		// --- static message ---
		var txt = this.add.bitmapText(60, 60, "fontwhite", "klaar voor de echte test?", 24);

		this.btnoefen = this.addButtonText(GAME_WIDTH_CENTER-240, GAME_HEIGHT_CENTER, "sprites", this.doPractise,  this, "button2",     "button1",     "button2",     "button1", "NOG 1 KEER\nOEFENEN");
		this.btnecht  = this.addButtonText(GAME_WIDTH_CENTER+240, GAME_HEIGHT_CENTER, "sprites", this.doRealGame,  this, "button2",     "button1",     "button2",     "button1", "ECHTE TEST");

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
