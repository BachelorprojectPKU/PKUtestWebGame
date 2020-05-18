		
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
		
		// save variables for callback
		btn.textdata = text;
		btn.ctx = callbackContext;
		btn.ondowncallback = callback;

		// set functions
		btn.on('pointerover', function (ptr, x, y) { this.first.setFrame(overFrame) } );
		btn.on('pointerout',  function (ptr)       { this.first.setFrame(outFrame); this.setScale(1.0, 1.0) } );
		btn.on('pointerdown', function (ptr)       { this.setScale(0.96, 0.96) } );
		//btn.on('pointerup', callback.bind(callbackContext));
		btn.on('pointerup',   function (ptr, x, y) {
			this.ondowncallback.call(this.ctx, this);
			} );
		
		return btn;
};


var MENU_ENTER_LEFT  = 1;
var MENU_ENTER_RIGHT = 2;
var MENU_EXIT_LEFT   = 3;
var MENU_EXIT_RIGHT  = 4;

// move container in a scene
// navigate between different GUI parts
Phaser.Scene.prototype.moveScene = function(cntScene, iMoveCode, xOffset)
{
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
};

Phaser.Scene.prototype.onMoveSceneComplete = function(tw, ary)
{
	// make container invisible

	// not visible if container is exit to left (x = -480) or to right (x = 480)
	var cnt = ary[0];
	cnt.visible = (cnt.x == 0);
};