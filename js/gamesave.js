// Phaser3 PKU test webgame
// game save, separate scene to display any error messages while saving

// game end scene, dsplay message and go to next game
var GameSave = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function GameSave()
	{
		Phaser.Scene.call(this, { key: "gamesave" });
	},

	preload: function()
	{

	},
	
	init: function(data)
	{
		// save results from game
		this._results = (typeof data.results !== "undefined" ? data.results : []);
		this._times   = (typeof data.times   !== "undefined" ? data.times   : []);
		
		// !! TESTING !!
		//this._results = ["LE1ok", "RI1ok", "LE1ok", "RI1ok", "LE1ok"];
		//this._times   = [645, 872, 508, 912, 784];
	},

	create: function(data)
	{
		// save results from game
		this._results = (typeof data.results !== "undefined" ? data.results : []);
		this._times   = (typeof data.times   !== "undefined" ? data.times   : []);

		// save game message
		this._gametxt = "game " + globalvar.game + "-" + globalvar.game_part;
		str = "Resultaten " + this._gametxt + " opslaan, moment..";
		this._msg = this.add.bitmapText(60, 60, "fontwhite", str, 24);
		
		if (this._times.length > 0) {
			// game part finished, save results
			this.saveResults();
		} else {
			// coming from login screen
			this.doContinue();
		};
	},

	saveResults: function() {

		//this.saveResultLocal(gam, prt, tim, res);
		this.saveResultOnline(globalvar.game, globalvar.game_part, this._times, this._results);

	},
	
	saveResultOnline: function(gam, prt, tim, res) {

		// variable prefixes
		var prefix = "bs";
		if (gam == 2) prefix = "ssv";
		if (gam == 3) prefix = "fi";
		if (gam == 4) prefix = "ife";

		// build url
		var url = PKU_URL + "new_game" + gam + prefix + ".php";
		
		// parameters
		prefix = prefix.toUpperCase() + "_";
		var paramsdata = 
			"studynr=" + globalvar.studynr +
			"&gamepart=" + prt;

		// times
		for (var i = 0; i < tim.length ; i++) {
			var nr = ("0"+(i+1)).slice(-2);
			var par = prefix + "TIM" + nr + "=" + tim[i];
			paramsdata = paramsdata + "&" + par;
		};
		
		// results (except for game 1)
		if (typeof res !== "undefined") {
			for (var i = 0; i < res.length ; i++) {
				var nr = ("0"+(i+1)).slice(-2);
				var par = prefix + "RES" + nr + "=" + res[i];
				paramsdata = paramsdata + "&" + par;
			};
		};

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
						console.log('results sent succesfully');
						// success message
						this.successSaving();
					} else {
						console.log('game score sent failed');
						this.errorSaving(-1, getjson.message);
					};
				};
			} else {
				// We reached our target server, but it returned an error
				console.log('game score sent failed with error ' + request.status + ': ' + request.statusText);
				this.errorSaving(request.status, request.statusText);
			}
		}.bind(this); // <- only change

		//paramsdata = getUserAgentParams();
		request.send(paramsdata);
	},

	update: function(time, delta)
	{
		// keyboard input
	},
	
	render: function()
	{
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

	doContinue: function()
	{
		var max_part = 2;
		switch (globalvar.game) {
			case 1: // game 1, 2 parts: non-dominant and dominant
				max_part = 2;
				break;
			case 2: // game 2, 3 parts: groen, rood, groen+rood
				max_part = 3;
				break;
			case 3: // game 3, 1 part
				max_part = 1;
				break;
			case 4: // game 4, 4 parts: happy, sad, angry, scared
				max_part = 4;
				break;
		};
		
		// next game part
		globalvar.game_part++;
		if (globalvar.game_part <= max_part) {
			this.scene.start("tutorial" + globalvar.game);
		} else {
			// all parts finished, end screen for game
			this.scene.start("gameend");
		};		
	}
});
