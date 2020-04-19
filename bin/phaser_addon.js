		
// add icon button to scenes
// similar to buttons in Phaser v2
Phaser.Scene.prototype.addButton = function(x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
{
		// add a button
		var btn = this.add.sprite(x, y, key, outFrame).setInteractive();
		btn.on('pointerover', function (ptr, x, y) { this.setFrame(overFrame) } );
		btn.on('pointerout',  function (ptr)       { this.setFrame(outFrame) } );
		btn.on('pointerdown', function (ptr)       { this.setScale(0.9, 0.9) } );
		btn.on('pointerup', callback.bind(callbackContext));
		
		return btn;
};

		
// add text button to scenes
// similar to buttons in Phaser v2
Phaser.Scene.prototype.addButtonText = function(x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, text)
{
		// add background sprite
		var spr = this.add.sprite(0, 0, key, outFrame);
        var w = spr.getBounds().width;
        var h = spr.getBounds().height;

		// add text
        var txt = this.add.text(0, 0, text, { font: "32px Arial Black", fill: "#ffffff" });
		// center text around 0,0
        txt.x  = -1 * (txt.width / 2);
        txt.y  = -1 * (txt.height / 2);

		// add it all to a container
		var btn = this.add.container(0, 50).setSize(w, h).add([spr, txt]);
		btn.x = x;
		btn.y = y;
		btn.setInteractive();

		// set functions
		btn.on('pointerover', function (ptr, x, y) { this.first.setFrame(overFrame) } );
		btn.on('pointerout',  function (ptr)       { this.first.setFrame(outFrame); this.setScale(1.0, 1.0) } );
		btn.on('pointerdown', function (ptr)       { this.setScale(0.9, 0.9) } );
		btn.on('pointerup', callback.bind(callbackContext));
		
		return btn;
};
