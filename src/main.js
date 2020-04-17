/* Bachelor project (afstudeerproject)
   Faculteit Medische Wetenschappen

   Studenten: Luna Beute, Allysa Dijkstra, Iris Stroot
   ICT ondersteuning: Bas de Reuver
*/

var STATE_INTRO  =   0;
var STATE_DEEL1  =  10;
var STATE_DEEL2  =  20;
var STATE_DEEL3  =  30;
var STATE_DEEL4  =  40;
var STATE_SCORES = 100;

// namespace
var ANTtest = ANTtest || {
	patientnr: "",
	scores: [],
	currentgame: 0,
	state: 0
};

// ANT test library
// state for the state manager

ANTtest.State = function () {

    this.anttest = null;
    this.key = ""; // state name

    this.statemanager = null;
};

ANTtest.State.prototype = {
	// additional methods, can implemented by each state
    init: function () {
    },

    preload: function () {
    },

    loadUpdate: function () {
    },

    loadRender: function () {
    },

    create: function () {
    },

    update: function () {
    },

    close: function () {
    }
};

ANTtest.State.prototype.constructor = ANTtest.State;

// ANT test library
// Bas de Reuver (c)2020

// -------------------------------------
// the state manager
// -------------------------------------
ANTtest.StateManager = function (anttest) {
    this.anttest = anttest;
    this._currentState = "";
    this._pendingState = "";
	this.states = {}; // hold all states
};

ANTtest.StateManager.prototype = {

   add: function (key, state) {
		//state.game = this.game;
        this.states[key] = new state(this.anttest);

		this._pendingState = key;
	
        return state;
    },
	
    start: function (key) {

		this.anttest.cleartimers();

		if (this._currentState) {
			// close previous state
			this.states[this._currentState].close();
			this.states[this._currentState].destroy;
			this._currentState = "";
		};
		// start new state
		this._pendingState = key;
		this._currentState = key;
		this.states[this._currentState].init();
    },

    currentState: function () {

		if (this._currentState) {
			return this.states[this._currentState];
		};
    },

    checkSwitch: function () {
		// switch to next state
		if (this._currentState != this._pendingState) {
			this._currentState = this._pendingState;
			this.states[this._currentState].init();
		};
    }

};
// ANT test library
// Bas de Reuver (c)2020

// -------------------------------------
// request animation frame
// -------------------------------------
ANTtest.AnimationFrame = function (anttest) {
	// save reference to game object 
	this.anttest = anttest;
	this.raftime = null;
};

ANTtest.AnimationFrame.prototype = {

    start: function () {
		var vendors = [
			"ms",
			"moz",
			"webkit",
			"o"
		];

		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
		{
			window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
			window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"];
		}

		animationlast = 0.0;

		var _this = this;

		// cannot use requestAnimationFrame for whatever reason, fall back on `setTimeout`
		if (!window.requestAnimationFrame)
		{
			useSetTimeout = true;

			animationLoop = function () {
				return _this.updateSetTimeout();
			};

			_timeOutID = window.setTimeout(this.animationLoop, 0);
		}
		else
		{
			// use requestAnimationFrame
			useSetTimeout = false;

			animationLoop = function (time) {
				return _this.updateAnimFrame(time);
			};

			_timeOutID = window.requestAnimationFrame(animationLoop);
		}
	},
	
    updateAnimFrame: function (rafTime) {
		// check if switch to pending new state
		this.anttest.state.checkSwitch();

		// floor the rafTime to make it equivalent to the Date.now() provided by updateSetTimeout (just below)
		this.raftime = Math.floor(rafTime);
		this.anttest.updateloop(this.raftime);

		_timeOutID = window.requestAnimationFrame(animationLoop);
	},
	
    updateSetTimeout: function () {
		// check if switch to pending new state
		this.anttest.state.checkSwitch();

		this.raftime = Date.now();
		this.anttest.updateloop(this.raftime);

		var ms = Math.floor(1000.0 / 60.0);
		_timeOutID = window.setTimeout(animationLoop, ms);
	}
}

//ANTtest.HighScores.prototype.constructor = ANTtest.HighScores;
// ANT test library
// Bas de Reuver (c)2020

// -------------------------------------
// game object
// -------------------------------------
ANTtest.Game = function () {

	// state manager
	this.state = new ANTtest.StateManager(this);
	
	// keep track of score results
	this.scores = new ANTtest.ScoreResults(this);
 	
	// request animation frame
	this.raf = new ANTtest.AnimationFrame(this);

	this.timers = [];

	// key indicator divs
	this._keyind1 = null;
	this._keyind2 = null;

	// mouse or touch input
	this._touchdevice = false;
	//this._mousedevice = false

	return this;
}

ANTtest.Game.prototype = {

	// -------------------------------------
	// start the specific game
	// -------------------------------------
	initGame: function() {
		document.body.scrollTop = 0;
		document.body.style.overflow = "hidden";
	
		// prepare sounds?
        if ("ontouchstart" in document.documentElement || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints >= 1))
        {
            this._touchdevice = true;
        };

		// bind input
		if (document.addEventListener) { // chrome, firefox
			// mouse/touch
			//document.addEventListener("mousedown", this.onmousedown.bind(this), false);
			//document.addEventListener("mouseup",   this.onmouseup.bind(this), false);
			// keyboard
			document.addEventListener("keydown", this.onkeydown.bind(this), false);
			document.addEventListener("keyup",   this.onkeyup.bind(this), false);

		} else { // IE8
			// mouse/touch
			//document.attachEvent("mousedown", this.onmousedown.bind(this));
			//document.attachEvent("mouseup",   this.onmouseup.bind(this));
			// keyboard
			document.attachEvent("keydown", this.onkeydown.bind(this));
			document.attachEvent("keyup",   this.onkeyup.bind(this));
		};

		// get key indicator divs
		this._keyind1 = document.getElementById("indkey1");
		this._keyind2 = document.getElementById("indkey2");
		this.scorecontent = document.getElementById("scorecontent");

		this.raf.start();

		console.log("ANTtest.js v1.0 :: start");
	},
	
	tinyMarkDown: function(str) {
		// \n => <br/>
		str = str.replace(/\n/gi, "<br/>");

		// *bold* => <b>bold</b>
		str = str.replace(/\*.*?\*/g, function(foo){
			return "<b>"+foo.slice(1, -1)+"</b>";
		});
		
		// _italic_ => <i>italic</i>
		str = str.replace(/\_.*?\_/g, function(foo){
			return "<i>"+foo.slice(1, -1)+"</i>";
		});
		
		// [button] => <btn>button</btn>
		str = str.replace(/\[(?:(?!\[).)*?\](?!\()/g, function(foo){
			return "<btn>"+foo.slice(1, -1)+"</btn>";
		});
		
		// hyperlinks [url text](www.test.com) => <a href="http://www.test.com">url text</a>
		str = str.replace(/(\[(?:(?!\[).)*?\])(\((?:(?!\().)*?\))/g, function(all, fst, sec, pos){
			var url = sec.slice(1, -1);
			if (url.indexOf("http") != 0) url = "http://" + url;
			var txt = fst.slice(1, -1);
			return '<a href="' + url + '">' + txt + '</a>';
		});
		
		return str;
	},

	// -------------------------------------
	// timers and game loop
	// -------------------------------------
	addtimer: function(context, callback, ms, waitfirst) {

		// after .start() do instantly start callbacks (true), or wait the first time (false), so:
		// true  => .start() [callback] ..wait ms.. [callback] ..wait ms.. etc.
		// false => .start() ..wait ms.. [callback] ..wait ms.. [callback] etc.
		if (typeof waitfirst === "undefined") waitfirst = true;

		// add new timer object
		var tim = new ANTtest.Timer(context, callback, ms, waitfirst);
		
		this.timers.push(tim);
		
		return tim;
	},

	cleartimers: function() {
		// clear all timers
		for (var t=0; t < this.timers.length; t++) {
			this.timers[t].pause();
			this.timers[t] = null;
		};
		this.timers = [];
	},
	
	updateloop: function(timestamp) {
		// check all timers
		for (var t=0; t < this.timers.length; t++) {
			if (this.timers[t].enabled) {
				this.timers[t].update(timestamp);
			};
		};
	},

	gameReset: function(gamenr) {
		// new game reset variables
		this.gamenr = gamenr;
		this.buttonpress = 0;
		this.playtimestart = new Date();
	},

	// -------------------------------------
	// sound effects
	// -------------------------------------
	loadSoundEffects: function() {
		// handle error
		console.log("loadSoundEffects - TODO load sound effects");
	},

	setSoundMute: function (value) {
		this.soundmute = value;
	},

	soundIndexByName: function (name) {
		var idx = 0;
		for (var i = 0; i < this.gamedata.sounds.length; i++) {
			if (this.gamedata.sounds[i].name == name) {
				return i;
			};
		};
		return -1;
	},

	playSoundEffect: function (name) {
		
		// device sound is not muted
		if (!this.soundmute) {
			// get sound index from name
			var idx = this.soundIndexByName(name);
			
			// if sound exists
			if (idx >= 0) {
				// if sound is playing then stop it now
				if (this.gamedata.sounds[idx].audio.paused == false) {
					this.gamedata.sounds[idx].audio.pause();
					// fix for IE11
					if (!isNaN(this.gamedata.sounds[idx].audio.duration)) {
						this.gamedata.sounds[idx].audio.currentTime = 0;
					};
				};
				// start playing sound
				this.gamedata.sounds[idx].audio.play();
			};
		};
	},

	// -------------------------------------
	// random integer
	// -------------------------------------
	randomInteger: function(min, max) {
		max = max - min + 1;
		var r = Math.floor(Math.random() * max) + min;
		return r;
	},
	
	// -------------------------------------
	// add remove class
	// -------------------------------------
	addRemoveClass: function(id, ad, rm) {
		// show indication
		dv = document.getElementById(id);
		if (!dv) {
			console.log('addRemoveClass -- Element with id="' + id + '" not found');
			return;
		};
		var cl = dv.className;

		// remove both classes to avoid doubling
		cl = dv.className;
		if (Array.isArray(rm)) {
			for (var i=0; i < rm.length; i++) {
				var item = rm[i];
				cl = cl.replace(item, "");
			};
		} else {
			cl = cl.replace(rm, "");
		};
		if (ad) cl = cl.replace(ad, "");
		
		// add color class
		if (ad) cl = cl + " " + ad;
		dv.className = cl;
	},
	
	// -------------------------------------
	// keep track of results
	// -------------------------------------
	savaeResult: function(nr, res) {
		// store result
		
	},

	debugText: function(str) {
		// set text
		document.getElementById("debugtext").innerHTML = str;
	},

	drawDebugText: function() {
		if (this.debugtxt) {
			// set font and position
			this.context2d.font = "bold 24px sans-serif";
			var x = 50;
			var y = 50;

			var lineheight = 15;		
			var lines = this.debugtxt.split("\n");

			for (var i = 0; i<lines.length; i++) {
				// shadow text
				this.context2d.fillStyle = "#000";
				this.context2d.fillText(lines[i], x+2, y+2);
				// white text
				this.context2d.fillStyle = "#fff";
				this.context2d.fillText(lines[i], x, y);
				y = y + lineheight;
			};
		};
	},

	// -------------------------------------
	// mouse and keyboard input
	// -------------------------------------
	ontouchstart: function(evt) {

		evt.preventDefault();

		//  evt.changedTouches is changed touches in this event, not all touches at this moment
		for (var i = 0; i < event.changedTouches.length; i++)
		{
			this.onmousedown(event.changedTouches[i]);
		}
	},
	
	ontouchend: function(evt) {
		evt.preventDefault();

		//  evt.changedTouches is changed touches in this event, not all touches at this moment
		for (var i = 0; i < evt.changedTouches.length; i++)
		{
			this.onmouseup(evt.changedTouches[i]);
		}
	},

	onmousedown: function(evt) {

		var x = (evt.offsetX || evt.clientX - evt.target.offsetLeft);
		var y = (evt.offsetY || evt.clientY - evt.target.offsetTop);

		//var x = evt.layerX;
		//var y = evt.layerY;
		x = x / this.scaleFactor;
		y = y / this.scaleFactor;

		// check if pressed in defined buttons
		for (var i=0; i < this.gamedata.buttons.length; i++) {
			// inside button touch area
			if (   (x > this.gamedata.buttons[i].area.x1)
				&& (x < this.gamedata.buttons[i].area.x2)
				&& (y > this.gamedata.buttons[i].area.y1)
				&& (y < this.gamedata.buttons[i].area.y2)
			) {
				var btnidx = 0;
				// which type of device button
				switch(this.gamedata.buttons[i].type) {
					case "updown":
						// two direction button up/down
						var yhalf = ((this.gamedata.buttons[i].area.y2 - this.gamedata.buttons[i].area.y1) / 2);
						// up or down
						btnidx = (y < this.gamedata.buttons[i].area.y1 + yhalf ? 0 : 1);
						break;
					case "leftright":
						// two direction button left/right
						var xhalf = ((this.gamedata.buttons[i].area.x2 - this.gamedata.buttons[i].area.x1) / 2);
						// left or right
						btnidx = (x < this.gamedata.buttons[i].area.x1 + xhalf ? 0 : 1);
						break;
					case "dpad":
						// four direction button up/down/left/right
						var xhalf = ((this.gamedata.buttons[i].area.x2 - this.gamedata.buttons[i].area.x1) / 2);
						var yhalf = ((this.gamedata.buttons[i].area.y2 - this.gamedata.buttons[i].area.y1) / 2);
						// distance to center
						var xdist = x - this.gamedata.buttons[i].area.x1 - xhalf;
						var ydist = y - this.gamedata.buttons[i].area.y1 - yhalf;
						if (Math.abs(xdist) < Math.abs(ydist)) {
							// up or down
							btnidx = (ydist < 0 ? 0 : 1); // 0=up, 1=down
						} else {
							// left or right
							btnidx = (xdist < 0 ? 2 : 3); // 2=left, 3=right
						};
						break;
					//default: // case "button":
					//	// simple button
					//	btnidx = 0;
					//	break;
				};
				// button press down
				this.onButtonDown(i, btnidx);
			};
		};
	},
	
	onmouseup: function(evt) {

		var x = (evt.offsetX || evt.clientX - evt.target.offsetLeft);
		var y = (evt.offsetY || evt.clientY - evt.target.offsetTop);
		
		//var x = evt.layerX;
		//var y = evt.layerY;
		var x = x / this.scaleFactor;
		var y = y / this.scaleFactor;

		// check if pressed in defined buttons
		for (var i=0; i < this.gamedata.buttons.length; i++) {
			// inside button touch area
			if (   (x > this.gamedata.buttons[i].area.x1)
				&& (x < this.gamedata.buttons[i].area.x2)
				&& (y > this.gamedata.buttons[i].area.y1)
				&& (y < this.gamedata.buttons[i].area.y2)
			) {
				var btnidx = 0;
				// which type of device button
				switch(this.gamedata.buttons[i].type) {
					case "updown":
						// two direction button up/down
						var half = ((this.gamedata.buttons[i].area.y2 - this.gamedata.buttons[i].area.y1) / 2);
						// up or down
						btnidx = (y < this.gamedata.buttons[i].area.y1 + half ? 0 : 1);
						break;
					case "leftright":
						// two direction button left/right
						var half = ((this.gamedata.buttons[i].area.x2 - this.gamedata.buttons[i].area.x1) / 2);
						// left or right
						btnidx = (x < this.gamedata.buttons[i].area.x1 + half ? 0 : 1);
						break;
					case "dpad":
						// four direction button up/down/left/right
						var xhalf = ((this.gamedata.buttons[i].area.x2 - this.gamedata.buttons[i].area.x1) / 2);
						var yhalf = ((this.gamedata.buttons[i].area.y2 - this.gamedata.buttons[i].area.y1) / 2);
						// distance to center
						var xdist = x - this.gamedata.buttons[i].area.x1 - xhalf;
						var ydist = y - this.gamedata.buttons[i].area.y1 - yhalf;
						if (Math.abs(xdist) < Math.abs(ydist)) {
							// up or down
							btnidx = (ydist < 0 ? 0 : 1); // 0=up, 1=down
						} else {
							// left or right
							btnidx = (xdist < 0 ? 2 : 3); // 2=left, 3=right
						};
						break;
					//default: // case "button":
					//	// simple button
					//	btnidx = 0;
					//	break;
				};
				// button release
				this.onButtonUp(i, btnidx);
			};
		};
	},

	onkeydown: function(e) {
		// get keycode
		var keyCode = e.keyCode;

		// check if keycode Z,X
		if ( (keyCode == 90) || (keyCode == 88) ) {
			this.onButtonDown(-1);
		};
		// check if keycode N,M
		if ( (keyCode == 78) || (keyCode == 77) ) {
			this.onButtonDown(+1);
		};
	},
	
	onkeyup: function(e) {
		// get keycode
		var keyCode = e.keyCode;
		
		// check if keycode Z,X
		if ( (keyCode == 90) || (keyCode == 88) ) {
			this.onButtonUp(-1);
		};
		// check if keycode N,M
		if ( (keyCode == 78) || (keyCode == 77) ) {
			this.onButtonUp(+1);
		};
	},
	
	onButtonDown: function(btnidx) {
		// show indication
		var dv = (btnidx == -1 ? this._keyind1 : this._keyind2);
		var ad = (btnidx == -1 ? "color_left" : "color_right");
		var cl = this._keyind1.className;

		// remove any previous color
		cl = dv.className;
		cl = cl.replace("dgrey", "");
		cl = cl.replace("color_left", "");
		cl = cl.replace("color_right", "");
		
		// add color class
		cl = cl + " " + ad;
		dv.className = cl;

		// handle button press
		this.state.currentState().keypress(btnidx);
	},
	
	onButtonUp: function(btnidx) {
		// remove indication
		var dv = (btnidx == -1 ? this._keyind1 : this._keyind2);
		var cl = this._keyind1.className;

		// remove any previous color
		cl = dv.className;
		cl = cl.replace("dgrey", "");
		cl = cl.replace("color_left", "");
		cl = cl.replace("color_right", "");
		
		// set color to dark-grey
		cl = cl + " dgrey";
		dv.className = cl;
	},

	// -------------------------------------
	// check if touch device
	// -------------------------------------
	is_touch_device: function() {
		var el = document.createElement("div");
		el.setAttribute("ANTtest.js - ongesturestart", "return;");
		if(typeof el.ongesturestart === "function"){
			return true;
		}else {
			return false
		}
	}
};

// ANT test library
// Bas de Reuver (c)2020

var COUNT_GAMES = 4;

// -------------------------------------
// score results object
// -------------------------------------
ANTtest.ScoreResults = function (anttest) {
	// save reference to game object
	this.anttest = anttest;

	// display variables
	this.results = [];
};

ANTtest.ScoreResults.prototype = {

    init: function (patientnr) {
		// check for existing results
		this.loadGlobal(patientnr);

		// nothing found
		if (this.results.length == 0) {
			this.loadLocal();
		}
	},

	loadLocal: function () {

		// clear variables
		this.results = [];
		this._patientnr = patientnr;
		var namecache = "anttest_local_"+this._patientnr;

		// load from localstorage
		var sc = window.localStorage.getItem(namecache);

		// error checking, localstorage might not exist yet at first time start up
		try {
			this.results = JSON.parse(sc);
		} catch (e) {
			this.results = []; //error in the above string(in this case,yes)!
		};
		// error checking just to be sure, if localstorage contains something else then a JSON array (hackers?)
		if (Object.prototype.toString.call(this.results) !== "[object Array]") {
			this.results = [];
		};
	},

    saveLocal: function () {
		// save highscores locally
		var namecache = "anttest_local_"+this._patientnr;
		window.localStorage.setItem(namecache, JSON.stringify(this.results));
    },

    saveGlobal: function (pat, gm, res) {
		
			// TODO save online?
			// TODO save where?
			return;
			
			// reserved characters in url
			//var gametitle = gametitle.replace(/\&/g, "%26"); // & -> %26
			var plr = plr.replace(/\&/g, "%26"); // & -> %26

			// build url
			var url = ANT_RES_URL + "newhs.php";
			var paramsdata = 
				"patnr=" + patthis +
				"&game=" + gm +
				"&result=" + res;

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
							console.log('Highscore sent succesfully');
							// result contains rank, set offset to corresponding page
							// for example getjson.rank=23 -> offset=20
							var rank = (getjson.rank ? (!isNaN(getjson.rank) ? getjson.rank : 1) : 1);
							this.offset = RANKS_PER_PAGE * Math.floor((rank-1) / RANKS_PER_PAGE);
							// load highscores
							this.loadGlobal();
							displayScorebox();
						} else {
							console.log('Highscore sent failed');
						};
					};
				} else {
					// We reached our target server, but it returned an error
					console.log('Highscore sent failed with error ' + request.status + ': ' + request.statusText);
				}
			}.bind(this); // <- only change

			//paramsdata = getUserAgentParams();
			request.send(paramsdata);
    },

    newResult: function (gm, res) {
		debugger;
		// check fail safe
		if ( (gm >= 1) && (gm <= 4) ) {
			this.results[(gm-1)] = res;

			this.saveLocal(gm, res);
			//this.saveGlobal(gm, res);
		};
    },
	
	loadGlobal: function (gm) {
		
		// TODO load online?
		// TODO load from where?
		return;

		var url = ANT_RES_URL + "geths.php" +
			"patnr=" + this._patientnr +
			"&game=" + gm;

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, true); // true for asynchronous 
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				this.afterLoadGlobal(xmlHttp.responseText);
		}.bind(this); // <- only change
		xmlHttp.send(null);
	},
	
	afterLoadGlobal: function (data) {
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
			for (var l=0; l < this.results.length; l++) {
				// same name and same score, probably the same -> display as red font
				if (   (this._scores_global[g].player == this.results[l].player)
					&& (this._scores_global[g].score == this.results[l].score) ) {
					this._scores_global[g].local = true;
				};
			};
		};

		this.refreshHTML();
	},

	refreshHTML: function () {
		// refresh values in score result rows
		var rows = "";
		for (var i = 0; i < COUNT_GAMES; i++) {
			var res = this.results[i];
			
			// get record
			if (typeof res === "undefined") {
				var rk = this.offset + (i+1);
				res = [];
			};

			// build html
			rows = rows + "      <tr><td>" + (i+1) + "</td><td>" + JSON.stringify(res) + "</td></tr>";
		};

		// game name and column headers
			
		var str =
			'<table class="scoretable">' +
			'      <tr><td>Game</td><td>Resultaat</td></tr>' +
			rows +
			'</table>';
			
		// refresh html content
		this.anttest.scorecontent.innerHTML = str;
    },

	guessOsBrowser: function () {
		// Also send OS and browser with highscores, for library optimizing
		// Educated guess; far from accurate
		// Determining the device/os/browser goes beyond the scope of this ANTtest library
		// For more accurately determining os/browser use library platform.js or similar library

		// initialise
		var device = "";
		var os = "";
		var browser = "";
		
		// note: navigator.userAgent is a mess
		var ua = navigator.userAgent || navigator.vendor || window.opera;

		// -------------------------------------
		//       device guesses
		// -------------------------------------
		// BlackBerry
		if (/BlackBerry|BB10|PlayBook|Passport/i.test(ua)) {
			device = "BlackBerry"
		} else
		// samsung mobiles
			if (/GT-I9\d{3}|SM-G9\d{2}/.test(ua)) {device = "Galaxy S-series"}
		else if (/SM-A\d{3}/.test(ua)) {device = "Galaxy A-series"}
		else if (/SM-J\d{3}/.test(ua)) {device = "Galaxy J-series"}
		else if (/SM-T\d{3}/.test(ua)) {device = "Galaxy Tab"}
		else if (/SM-N\d{3}/.test(ua)) {device = "Galaxy Note"}
		else if (/SAMSUNG/.test(ua)) {device = "Samsung"}
		// huawei
		else if (/huawei/i.test(ua)) {device = "Huawei"}
		// kindle
		else if (/kindle/.test(ua)) {device = "Kindle"}
		// Xbox One
		else if (/xbox one/i.test(ua)) {device = "Xbox One"}
		// Xbox 360
		else if (/xbox/i.test(ua)) {device = "Xbox 360"}
		// Playstation Vita, Playstation 3, Playstation 4
		else if (/playstation /i.test(ua)) {
			device = (/playstation [^;) ]*/i.exec(ua) || "Playstation")
		}
		// Wii U
		else if (/nintendo wii/i.test(ua)) {device = "Wii U"}
		// windows phone
		else if (/IEMobile|Windows Phone/i.test(ua)) {
			device = "Windows Phone"
		} else
		// iOS detection from: http://stackoverflow.com/a/9039885/177710
		if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
			if (/iPad/.test(ua))      { device = "iPad"}
			else if (/iPod/.test(ua)) { device = "iPod"}
			else                      ( device = "iPhone" );
		} else
		// Mac OS desktop
		if (/mac os|macintosh/i.test(ua)) {
			device = "Macintosh"
		};

		// -------------------------------------
		//       OS guesses
		// -------------------------------------
		// Windows Phone must come first because its UA also contains "Android"
		if (/tizen /i.test(ua)) {
			os = (/tizen [^;)]*/i.exec(ua)[0] || "Tizen")
		} else
		// Windows Phone must come first because its UA also contains "Android"
		if (/windows phone/i.test(ua)) {
			os = "Windows Phone"
		} else
		if (/android /i.test(ua)) {
			os = (/android [^;)]*/i.exec(ua)[0] || "Android")
		} else
		// iOS detection from: http://stackoverflow.com/a/9039885/177710
		if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
			var osvar = /(iphone os |cpu os )[^;) ]*/i.exec(ua);
			os = (osvar[0] || "");
			os = os.replace(/cpu|iphone|os/ig, "").trim();
			os = "iOS " + os.replace(/_/g, ".");
		} else
		if (/mac os/i.test(ua)) {
			os = "Mac OS"
		} else
		if ( (/windows /i.test(ua)) ) {
			var osvar = /windows [^;)]*/i.exec(ua)[0];
			os = (osvar || "Windows");

			if (/10/.test(osvar))      os = "Windows 10"
			if (/6.3/.test(osvar))     os = "Windows 8.1"
			if (/6.2/.test(osvar))     os = "Windows 8"
			if (/6.1/.test(osvar))     os = "Windows 7"
			if (/6.0/.test(osvar))     os = "Windows Vista"
			if (/5.1|5.2/.test(osvar)) os = "Windows XP"
			if (/5.0/.test(osvar))     os = "Windows 2000"
		} else
		// any other
			{os = navigator.platform};

		// -------------------------------------
		//       Browser guesses
		// -------------------------------------
		// Opera 8.0+
		if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
			browser = "Opera 8.0+";
		} else
		// Firefox 1.0+
		if (typeof InstallTrigger !== 'undefined') {
			browser = "Firefox 1.0+";
		} else
		// Edge 20+
		if (/edge/i.test(ua)) {
			browser = "Edge";
		} else
		// Chrome 1+
		if ( (/chrome/i.test(ua)) && (/google/i.test(navigator.vendor)) ) {
			browser = "Chrome";
		} else
		// Safari 3.0+ "[object HTMLElementConstructor]" 
		if ( (/safari/i.test(ua)) && (/apple computer/i.test(navigator.vendor)) ) {
			browser = "Safari";
		} else
		// Internet Explorer mobile
		if (/iemobile/i.test(ua)) {
			browser = (/iemobile[^;) ]*/i.exec(ua)[0] || "IEMobile")
		} else
		// Internet Explorer
		if (/MSIE /.test(ua)) {
			browser = (/MSIE [^;) ]*/.exec(ua)[0] || "MSIE")
		} else
		// Internet Explorer 11
		if (/rv\:11\./.test(ua)) {
			browser = "MSIE 11";				
		} else
		// Internet Explorer 6-11
		if ( /*@cc_on!@*/false || !!document.documentMode) {
			browser = "MSIE 6-11";
		};
		
		// replace problematic characters
		device  =  device.replace(/&|\?|\//g, " ").trim();
		os      =      os.replace(/&|\?|\//g, " ").trim();
		browser = browser.replace(/&|\?|\//g, " ").trim();
		
		// return result
		return {"device": device, "os": os, "browser": browser};
	}
};

//ANTtest.ScoreResults.prototype.constructor = ANTtest.ScoreResults;


// ANT test library
// Bas de Reuver (c)2020

// -------------------------------------
// pulse timer object
// -------------------------------------
ANTtest.Timer = function (context, callback, interval, waitfirst) {
	// context of callback
	this.context = context;
	
	// Event: Timer tick
	this.callback = callback;

	// frequency of the timer in milliseconds
	this.interval = interval || 1000;
	
	// call callback instantly, or wait one pulse until calling callback
	this.waitfirst = waitfirst;

	// counter, useful for directing animations etc.
	this.counter = 0;

	// maximum counter, useful for directing animations etc.
	this.max = null;

	// Property: Whether the timer is enable or not
	this.enabled = false;

	// Member variable: Hold interval id of the timer
	this.timerId = 0;
	this.lasttime = 0;
}
	
ANTtest.Timer.prototype = {

	// update each frame
	update: function(timestamp) {
		//debugger;
		var varname = this.callback.name;
		//for (var key in this.context) {
		//	if (this.context.hasOwnProperty(key)) {
		//		if (key.indexOf("timer") >= 0) {
		//			varname = key;
		//			break;
		//		};
		//	};
		//};
		
		var delta = timestamp - this.lasttime;
		
		// timer tick
		if (delta >= this.interval) {
			//console.log("ANTtest.Timer<"+varname+">.update() -> delta="+delta+" this.interval="+this.interval+" this.lasttime="+this.lasttime+" this.waitfirst="+this.waitfirst);
			//this.lasttime = timestamp;
			this.lasttime = this.lasttime + this.interval;
			// game callbacks
			this.doTimerEvent();
		};
	},
	
	// local timer event of Timer-object
	doTimerEvent: function() {
		// keep track how many times event has fired
		this.counter++;

		// do callback function to gameobj, so not to ANTtest.Timer object
		this.callback.call(this.context, this);

		// if maximum of callbacks was set
		if (typeof this.max !== "undefined") {
			if (this.counter >= this.max) this.enabled = false;
		};
	},

	// start/enable the timer
	start: function(max, waitfirst) {
		// change waitfirst only when passed as parameter
		if (typeof waitfirst !== "undefined") this.waitfirst = waitfirst;
		// initialise variables
		this.enabled = true;
		this.counter = 0;
		this.max = max;
		//this.lasttime = 0;
		this.lasttime = (this.context.anttest.raf.raftime || 0);
		// start immediately?
		if (this.waitfirst == false) this.lasttime -= this.interval;
	},

	// pause the timer
	pause: function() {
		// initialise variables
		this.enabled = false;
	},

	// unpause the timer; continue but do not reset the counter
	unpause: function() {
		this.lasttime = (this.context.anttest.raf.raftime || 0);
		if (this.waitfirst == false) this.lasttime -= this.interval;
		this.enabled = true;
	}
};
