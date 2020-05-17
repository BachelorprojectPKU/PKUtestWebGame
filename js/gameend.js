// Phaser3 PKU test webgame
// game end display, filler scene between games

// game end scene, dsplay message and go to next game
var GameEnd = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameEnd()
    {
        Phaser.Scene.call(this, { key: "gameend" });
    },

    preload: function()
    {

    },
	
    init: function(data)
    {
		// which level
		this._levelindex = (typeof data.levelindex !== "undefined" ? data.levelindex : 0);
		globalvar.game_part = 1;
    },

    create: function()
    {
		// reset max practice counter for next game
		globalvar.practisecount = 0;

		// end of game message
		var str;
		var btn;
		if (globalvar.game < 4) {
			// game 1, 2, 3
			str = "Dat was test " + globalvar.game + ".\n\nKlik op volgende om door te gaan naar test " + (globalvar.game+1) + ".";
			btn = "Volgende";
		} else {
			// game 4
			str = "Je hebt alle onderdelen van de test afgerond.\n\nJe kan nu de browser of dit tabblad afsluiten.\n\nBedankt voor het meedoen :)";
			btn = "Afsluiten";
		};

		var txt1 = this.add.bitmapText(60, 60, "fontwhite", str, 24);
		if (globalvar.game < 4) {
			this.btnnext = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doNextGame,  this, "button2",     "button1",     "button2",     "button1", btn);
		};
    },

    update: function(time, delta)
    {
		// keyboard input
    },
	
    render: function()
    {
    },

	doNextGame: function()
    {
        console.log("GameEnd KNOP VOLGENDE volgende game globalvar.game=" + globalvar.game);
		if (globalvar.game <= 3) {
			// game 1, 2, 3, go to next game
			this.scene.start("tutorial" + (globalvar.game+1));
		} else {
			// game 4, close tab doesn't work due to security issues
			window.close();
		};
		

    }
});
