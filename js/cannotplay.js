// Phaser3 PKU test webgame
// cannot play message

// cannot play
var CannotPlay = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function CannotPlay ()
    {
        Phaser.Scene.call(this, { key: "cannotplay" });
    },

    preload: function ()
    {

    },

    create: function ()
    {
		// --- static message ---
		var txttitle1 = this.add.bitmapText(60, 60, "fontwhite", "KEYBOARD NODIG VOOR DEZE TEST!", 24);
		var txt1 = this.add.bitmapText(60, 120,     "fontwhite", "Voor deze test is er een keyboard nodig.", 24);
		var txt2 = this.add.bitmapText(60, 120+60,  "fontwhite", "Deze test kan niet gedaan worden op een tablet of mobiel.", 24);
		var txt3 = this.add.bitmapText(60, 120+120, "fontwhite", "Open deze URL op een laptop of desktop computer.", 24);

		console.log("Cannot play, needs keyboard");
    }
});
