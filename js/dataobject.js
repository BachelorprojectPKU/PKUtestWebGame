// Phaser3 PKU test webgame
// JavaScript object to handle all data
// use global variable for use in all scenes

var PKU_URL = "http://bdrgames.nl/geneeskunde/php/";

var CONST_LEFT = 0;
var CONST_RIGHT = 1;

var MAX_TIMEOUTS = 1; // max. allowed timeouts before quiting
var TIMEOUT_DELAY = 3000; // when no input game-timeout after 10 seconds

var BACKGROUND_BLUE = '#4a86e8';
var BACKGROUND_BLACK = '#000000';

//var GAME1_REPEAT = 32;
//var GAME2_REPEAT = 32;
//var GAME3_REPEAT = 80;
//var GAME4_REPEAT = 40;
//var GAME1_REPEAT_PRACTISE = 10;
//var GAME2_REPEAT_PRACTISE = 10;
//var GAME3_REPEAT_PRACTISE = 12;
//var GAME4_REPEAT_PRACTISE = 10;

// !! TESTING !!
var GAME1_REPEAT = 10;
var GAME2_REPEAT = 10;
var GAME3_REPEAT = 10;
var GAME4_REPEAT = 10;
var GAME1_REPEAT_PRACTISE = 5;
var GAME2_REPEAT_PRACTISE = 5;
var GAME3_REPEAT_PRACTISE = 5;
var GAME4_REPEAT_PRACTISE = 5;
// !! TESTING !!


var globalvar = {
	studynr: "998877", // participant code
	dominant: 1, // 0=left hand, 1=right hand
	practise: true,
	timeoutcount: 0,
	game: 1,
	game_part: 1
};

PkuDataClass = function() {
	this.offset = 0;

	// game scores variables
	this._scores_local = [];
	this._scores_global = [];
	this._scoretype = 0;
};

PkuDataClass.prototype = {
	
	saveScore: function(gam, sco) {
		// adf
	},

	loadLocal: function(typ) {

		// clear variables
		this._scores_local = [];
		this._scoretype = typ; // typ = game type, for example 1 or 2)
		var namecache = "pkutest_local_"+this.gametitle+"_hs"+typ;

		// load from localstorage
		var sc = window.localStorage.getItem(namecache);

		// error checking, localstorage might not exist yet at first time start up
		try {
			this._scores_local = JSON.parse(sc);
		} catch (e) {
			this._scores_local = []; //error in the above string(in this case,yes)!
		};
		// error checking just to be sure, if localstorage contains something else then a JSON array (hackers?)
		if (Object.prototype.toString.call(this._scores_local) !== "[object Array]") {
			this._scores_local = [];
		};
	},

    saveResults: function(gam, prt, tim, res) {

		//this.saveResultLocal(gam, prt, tim, res);
		this.saveResultOnline(gam, prt, tim, res);

	},

    saveResultLocal: function(gam, prt, tim, res) {
		// always store local game scores
		var rec = {"player": plr, "score":sc, "level":lvl};

		// which place in local game scores
		var idx = this.indexLocal(sc, typ);
		if (idx < 0) {
			// at end
			this._scores_local.push(rec);
		} else {
			// some where in the middle
			this._scores_local.splice(idx, 0, rec);
		};

		// save game scores locally
		var namecache = "pkutest_local_"+this.gametitle+"_hs"+typ;
		window.localStorage.setItem(namecache, JSON.stringify(this._scores_local));

		// also save default entry name
		window.localStorage.setItem("pkutest_scores_name", plr);
    },

    saveResultOnline: function(gam, prt, tim, res) {

		// variable prefixes
		var prefix = "bs";
		if (gam == 2) prefix = "ssv";
		if (gam == 3) prefix = "fi";
		if (gam == 4) prefix = "ife";

		// build url
		var url = PKU_URL + "game" + gam + prefix + ".php";
		
		// parameters
		prefix = prefix.toUpperCase() + "_";
		var paramsdata = 
			"studynr=" + globalvar.studynr +
			"&gamepart=" + globalvar.game_part;

		// times
		for (var i = 0; i < tim.length ; i++) {
			var nr = ("0"+(i+1)).substring(0, 2);
			var par = prefix + "TIM" + nr + "=" + tim[i];
			paramsdata = paramsdata + "&" + par;
		};
		
		// results (except for game 1)
		if (typeof res !== "undefined") {
			for (var i = 0; i < res.length ; i++) {
				var nr = ("0"+(i+1)).substring(0, 2);
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
						console.log('scores sent succesfully');
						// result contains rank, set offset to corresponding page
						// for example getjson.rank=23 -> offset=20
						var rank = (getjson.rank ? (!isNaN(getjson.rank) ? getjson.rank : 1) : 1);
						this.offset = RANKS_PER_PAGE * Math.floor((rank-1) / RANKS_PER_PAGE);
						// load game scores
						this.loadGlobal();
						displayScorebox();
					} else {
						console.log('game score sent failed');
					};
				};
			} else {
				// We reached our target server, but it returned an error
				console.log('game score sent failed with error ' + request.status + ': ' + request.statusText);
			}
		}.bind(this); // <- only change

		//paramsdata = getUserAgentParams();
		request.send(paramsdata);
    },

	
	loadGlobal: function() {
		var url = PKU_URL + "geths.php" +
			"?gamename=" + this.gametitle +  // game score data
			"&gametype=" + this._scoretype +
			"&offset=" + this.offset; // 0=first page, 10=second page etc

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, true); // true for asynchronous 
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				this.afterLoadGlobal(xmlHttp.responseText);
		}.bind(this); // <- only change
		xmlHttp.send(null);
	},
	
	afterLoadGlobal: function(data) {
		// error checking, localstorage might not exist yet at first time start up
		try {
			this._scores_global = JSON.parse(data);
		} catch (e) {
			this._scores_global = []; //error in the above string(in this case,yes)!
		};
		// error checking just to be sure, if data contains something else then a JSON array (hackers?)
		if (Object.prototype.toString.call(this._scores_global) !== "[object Array]") {
			this._scores_global = [];
		};
		
		// flag if also local scores
		for (var g=0; g < this._scores_global.length; g++) {
			// add property "local"
			this._scores_global[g].local = false;
			// check if corresponding score in local scores
			for (var l=0; l < this._scores_local.length; l++) {
				// same name and same score, probably the same -> display as red font
				if (   (this._scores_global[g].player == this._scores_local[l].player)
					&& (this._scores_global[g].score == this._scores_local[l].score) ) {
					this._scores_global[g].local = true;
				};
			};
		};

		this.refreshHTML();
	}
};

