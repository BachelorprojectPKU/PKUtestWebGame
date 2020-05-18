// Phaser3 PKU test webgame
// study number login

// very first first screen
var LoginScreen = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoginScreen()
    {
        Phaser.Scene.call(this, { key: "loginscreen" });
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
		this._sysyear = new Date().getFullYear();
		this._loginfail = 0;

		this._loginpart = 1; // 1=studynr, 2=date of birth
		this._strstudynr = "";
		this._strgebdat = "";
		this._dtgebdat = new Date(this._sysyear-10, 12-1, 31);

		// add logo
        var logo = this.add.sprite(GAME_WIDTH_CENTER, 60, "sprites", "pkulogo");
		
		// --- static message and logo ---
		//var txttitle1 = this.add.bitmapText(60, 60, "fontwhite", "Login screen", 24);

		// --- tutorial message 1 ---
		this._cntLogin1 = this.add.container();

		var txt1 = this.add.bitmapText(GAME_WIDTH_CENTER, 120, "fontwhite", "Geef hieronder je studienummer op om te beginnen.", 24);
		txt1.setOrigin(0.5).setCenterAlign();
		
		var rec1 = createRectangle(this, 360, 192, 224, 64, 0x000040, 1.0);
	
		//this._txtstudynr = this.add.bitmapText(320, 160, "fontwhite", "", 24);
		this._txtstudynr = this.add.text(360+64, 192+16, "", { font: "32px Arial Black", fill: "#ffffff" });
		
		// key buttons
		for (var i=0; i < 12; i++) {
			// grid buttons
			var r = Math.floor(i / 3);
			var xpos = GAME_WIDTH_CENTER + (((i % 3)-1) * 80);
			var ypos = 320 + (r * 80);
			var str = ""+(i+1);

			// exception for "0"
			if (i >= 9) {
				//xpos = xpos + 80;
				str = (i < 11 ? (i < 10 ? "<<" : "0") : "ok");
			};

			// add button sprite
			var btn = this.addButtonText(xpos, ypos, "sprites", this.doDigit, this, "btn_round1", "btn_round0", "btn_round1", "btn_round0", str);
			this._cntLogin1.add(btn);
		};

		var btncredits = this.addButtonText(60, GAME_HEIGHT-60, "sprites", this.doCredits, this, "info_icon", "info_icon2", "info_icon", "info_icon2", "");

		// add all to container
		this._cntLogin1.add(txt1);
		this._cntLogin1.add(rec1);
		this._cntLogin1.add(btncredits);
		this._cntLogin1.add(this._txtstudynr);
		
		// --- tutorial message 2 ---
		this._cntLogin2 = this.add.container();

		var txt2 = this.add.bitmapText(GAME_WIDTH_CENTER, 180, "fontwhite", "Geef je geboortedatum ter controle.", 24);
		txt2.setOrigin(0.5).setCenterAlign();

		var ypos = 320;
		var rec2 = createRectangle(this, GAME_WIDTH_CENTER-112, ypos-32, 224, 64, 0x000040, 1.0);
		this._txtgebdat = this.add.text(GAME_WIDTH_CENTER-112+16, ypos-16, "", { font: "32px Arial Black", fill: "#ffffff" });
		
		// key buttons
		var btnday1  = this.addButtonText(GAME_WIDTH_CENTER-80, ypos-60, "sprites", this.doDateDay1, this, "btn_triangle1", "btn_triangle0", "btn_triangle1", "btn_triangle0", "");
		var btnday2  = this.addButtonText(GAME_WIDTH_CENTER-80, ypos+60, "sprites", this.doDateDay2, this, "btn_triangle3", "btn_triangle2", "btn_triangle3", "btn_triangle2", "");

		var btnmon1  = this.addButtonText(GAME_WIDTH_CENTER,    ypos-60, "sprites", this.doDateMonth1, this, "btn_triangle1", "btn_triangle0", "btn_triangle1", "btn_triangle0", "");
		var btnmon2  = this.addButtonText(GAME_WIDTH_CENTER,    ypos+60, "sprites", this.doDateMonth2, this, "btn_triangle3", "btn_triangle2", "btn_triangle3", "btn_triangle2", "");
	
		var btnyear1 = this.addButtonText(GAME_WIDTH_CENTER+80, ypos-60, "sprites", this.doDateYear1, this, "btn_triangle1", "btn_triangle0", "btn_triangle1", "btn_triangle0", "");
		var btnyear2 = this.addButtonText(GAME_WIDTH_CENTER+80, ypos+60, "sprites", this.doDateYear2, this, "btn_triangle3", "btn_triangle2", "btn_triangle3", "btn_triangle2", "");

		var btnlogin = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-120, "sprites", this.doLoginInput, this, "button_s2",   "button_s1",   "button_s2",   "button_s1",   "Login");

		// add all to container
		this._cntLogin2.add(txt2);
		this._cntLogin2.add(rec2);
		this._cntLogin2.add(this._txtgebdat);
		this._cntLogin2.add(btnday1);
		this._cntLogin2.add(btnday2);
		this._cntLogin2.add(btnmon1);
		this._cntLogin2.add(btnmon2);
		this._cntLogin2.add(btnyear1);
		this._cntLogin2.add(btnyear2);
		this._cntLogin2.add(btnlogin);

		// --- credits colofon ---
		this._cntCredits = this.add.container();
		
		var rec3 = createRectangle(this, 240, 120, 480, 400, 0xffffff, 1.0);
        var ruglogo = this.add.sprite(240+140, 120+40, "sprites", "ruglogo");

		//var txt3 = this.add.bitmapText(210+40, 120+80, "fontwhite", "Bachelorstudenten\nLuna Beute\nAllysa Dijkstra\nIris Stroot\n\nTechnische ondersteuning\nBas de Reuver", 24);
		var txt3 = this.add.text(240+60, 120+90, "Contact informatie onderzoekers\n  pkuonderzoek@rug.nl\n  050-1234567\n\nBachelorstudenten\n  Luna Beute\n  Allysa Dijkstra\n  Iris Stroot\n\nTechnische ondersteuning\n  Bas de Reuver", { font: "24px Arial", fill: "#000000" });

		//txt3.setOrigin(0.5).setCenterAlign();
		var btncreditok = this.addButtonText(GAME_WIDTH_CENTER, GAME_HEIGHT-60, "sprites", this.doExitCredits, this, "button_s2",   "button_s1",   "button_s2",   "button_s1",   "Ok");

		this._cntCredits.add(rec3);
		this._cntCredits.add(ruglogo);
		this._cntCredits.add(txt3);
		this._cntCredits.add(btncreditok);

		// key input handler
		this.input.keyboard.on('keydown', this.doLoginKeyDown, this);
		//this.input.keyboard.on('keyup',   this.doLoginKeyUp, this);
		
		this.refreshDate();
		this._strgebdat = ""; // make string empty, so that when start typing it will overwrite from beginning
		
		// only login panel visible
		//this._cntLogin1.visible = false;
		this._cntLogin2.visible = false;
		this._cntCredits.visible = false;

		console.log("LoginScreen create is ready");
    },

    //update: function(time, delta)
    //{
	//	// keyboard input
    //},
	
    //render: function()
    //{
	//	// test debug text
    //},

	doStudyNr: function()
    {
        console.log("goto doStudyNr was called!");
		// move screens
		this.moveScene(this._cntLogin1, MENU_ENTER_LEFT);
		this.moveScene(this._cntLogin2, MENU_EXIT_RIGHT);
    },

	doDoB: function()
    {
        console.log("goto doDoB was called!");
		// move screens
		this.moveScene(this._cntLogin1, MENU_EXIT_LEFT);
		this.moveScene(this._cntLogin2, MENU_ENTER_RIGHT);
    },
	
	doCredits: function()
    {
        console.log("doCredits was called!");
		this._loginpart = 0; // block keyboard input
		// move screens
		this.moveScene(this._cntCredits, MENU_ENTER_LEFT);
		this.moveScene(this._cntLogin1,  MENU_EXIT_RIGHT);
    },

	doExitCredits: function()
    {
        console.log("doExitCredits was called!");
		this._loginpart = 1; // 0=credits, 1=studynr, 2=date of birth
		// move screens
		this.moveScene(this._cntLogin1, MENU_ENTER_RIGHT);
		this.moveScene(this._cntCredits, MENU_EXIT_LEFT);
    },

    doDigit: function(cnt)
    {
		// get button label text
		var lbl = cnt.textdata;
		var cod = (lbl == "<<" ? -1 : (lbl == "ok" ? 99 : lbl));
		this.doLoginInput(cod);
    },
	
    doDateDay1: function(cnt)
    {
		this.doDateButtonEdit("day", +1)
    },
    doDateDay2: function(cnt)
    {
		this.doDateButtonEdit("day", -1)
    },
    doDateMonth1: function(cnt)
    {
		this.doDateButtonEdit("month", +1)
    },
    doDateMonth2: function(cnt)
    {
		this.doDateButtonEdit("month", -1)
    },
    doDateYear1: function(cnt)
    {
		this.doDateButtonEdit("year", +1)
    },
    doDateYear2: function(cnt)
    {
		this.doDateButtonEdit("year", -1)
    },
    doDateButtonEdit: function(part, num)
    {
		// adjust day
		if (part == "day") {
			var dat = this._dtgebdat.getDate() + num;
			this._dtgebdat = new Date(this._dtgebdat.setDate(dat));
		};

		// adjust month
		if (part == "month") {
			var mon = this._dtgebdat.getMonth() + num;
			this._dtgebdat = new Date(this._dtgebdat.setMonth(mon));
		};

		// adjust year
		if (part == "year") {
			var year = this._dtgebdat.getFullYear() + num;
			if (year < this._sysyear-100) year = this._sysyear;
			if (year > this._sysyear)     year = this._sysyear-100;
			this._dtgebdat = new Date(this._dtgebdat.setFullYear(year));
		};

		// refresh on screen
		this.refreshDate();
    },

    refreshDate: function()
    {
		this._strgebdat = ("0" + (this._dtgebdat.getDate())).slice(-2) + "-" + ("0" + (this._dtgebdat.getMonth()+1)).slice(-2) + "-" + this._dtgebdat.getFullYear().toString();
		
		this._txtgebdat.text = this._strgebdat;
	},

    doLoginKeyDown: function(evt) {
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
			// 1=studynr, 2=date of birth
			if (this._loginpart == 1) {
				this.doLoginInput(i);
			} else if (this._loginpart == 2) {
				this.doDateInput(i);
			};
		};

		// update inlog code
		if (this._loginpart == 2) {
			if ([189, 109, 190, 110, 191, 220].indexOf(evt.keyCode) >= 0) { // 189, 109 = -minus, 190, 110 = .dot, 191, 220=/\slash
				this.doDateInput("-");
			};
			// tab to complete date
			if (evt.keyCode == 9) {
				this.refreshDate();
			};
		};

		// enter/return
		if (this._loginpart != 0) {
			if (evt.keyCode == 13) {
				this.doLoginInput(99);
				//if (this._strstudynr.length == 5) {
				//	this.doStart();
				//};
			};
		};
	},
	
    doLoginInput: function(dig) {
		console.log("doLoginInput dig=" + dig);
		
		// date login button
		if (isNaN(dig)) dig = 99;

		// update input string
		if ( (dig >= 0) && (dig <= 9) ) {
			// add digit, max 5 characters
			if (this._strstudynr.length < 5) {
				this._strstudynr += dig;
			};
		} else if (dig < 0) {
			// backspace, remove last
			this._strstudynr = this._strstudynr.substring(0, this._strstudynr.length - 1);
		} else {
			if (this._strstudynr.length == 5) {
				// if typed incomplete date exampl "1-1-10", then show it complete now
				if (this._loginpart == 2) this.refreshDate();
				// check deelnemer
				this.getDeelnemer();
			};
		};

		// update on screen
		this._txtstudynr.text = this._strstudynr;
	},
	
    doDateInput: function(ch) {
		console.log("doDateInput ch=" + ch);

		if (ch == -1) {
			// backspace, remove last
			this._strgebdat = this._strgebdat.substring(0, this._strgebdat.length - 1);
		} else {
			// add character
			this._strgebdat += ch;
		};
		// fix any input error
		this.fixDateTextInput();

		this._txtgebdat.text = this._strgebdat;
	},
	
    fixDateTextInput: function() {
		// fix text input
		//if (this._strgebdat.length == 2) {
		//	if (this._strgebdat > 31) {
		//		this._strgebdat = this._strgebdat.substring(0, 1) + "-" + this._strgebdat.substring(1, 2);
		//	};
		//};

		// split to date month year
		var tmp = this._strgebdat.split(/[-/\\.]+/);

		// day cannot be larger than 31
		if (tmp.length == 1) {
			if ( (tmp[0] > 31) || (tmp[0].length > 2) ) {
				tmp[1] = tmp[0].substring(tmp[0].length-1, tmp[0].length);
				tmp[0] = tmp[0].substring(0, tmp[0].length-1);
				this._strgebdat = tmp[0] + "-" + tmp[1];
			};
		};
		
		// month cannot be larger than 12
		if (tmp.length == 2) {
			if ( (tmp[1] > 12) || (tmp[1].length > 2) ) {
				tmp[2] = tmp[1].substring(tmp[1].length-1, tmp[1].length);
				tmp[1] = tmp[1].substring(0, tmp[1].length-1);
				this._strgebdat = tmp[0] + "-" + tmp[1] + "-" + tmp[2];
			};
		};

		// user entered a date month year
		if (tmp.length >= 3) {
			// cut off any typing after 4 characters in year
			if (tmp[2].length > 4) tmp[2] = tmp[2].substring(0, 4);
		};

		// get date month year parts
		var d = parseInt(tmp[0]);
		var m = parseInt(tmp[1]);
		var y = parseInt(tmp[2]);
		d = (!isNaN(d) ? d : 31);
		m = (!isNaN(m) ? m : 12);
		y = (!isNaN(y) ? y : this._sysyear-10);
		// check year
		if (y < 100) y = y + 2000;
		while (y > this._sysyear)     y = y - 100;
		while (y < this._sysyear-100) y = y + 100;

		this._dtgebdat = new Date(y, m-1, d);

			// typing the year is complete
		if (tmp.length >= 3) {
			if (tmp[2].length == 4) {
				console.log("ok");
				this.refreshDate();
			};
		} else {
			this._txtgebdat.text = this._strgebdat;
		};
	},
	
	getDeelnemer: function() {

		// build url
		var url = PKU_URL + "get_dn.php?studynr=" + this._strstudynr;
		
		// also date
		if (this._loginpart == 2) {
			// date format yyyy-mm-dd
			var dob = this._dtgebdat.getFullYear().toString() + "-" + ("0" + (this._dtgebdat.getMonth()+1)).slice(-2) + "-" + ("0" + (this._dtgebdat.getDate())).slice(-2);
			url = url + "&dob=" + dob;
		};

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', url, true);
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		//xmlHttp.setRequestHeader("Content-length", paramsdata.length);
		//xmlHttp.setRequestHeader("Connection", "close");

		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
					this.startDeelnemer(xmlHttp.responseText);
			} else {
				// We reached our target server, but it returned an error
				console.log('Legacy get failed with error ' + xmlHttp.status + ': ' + xmlHttp.statusText);
				this.errorDeelnemer(xmlHttp.status, xmlHttp.statusText);
			}	
		}.bind(this); // <- only change

		xmlHttp.send(null);
	},
	
    errorDeelnemer: function(sta, txt)
    {
		this._loginfail++;
		
		// update inlog code
		if (this._loginpart == 1) {
			// clear code
			this._strstudynr = "";
			this._txtstudynr.text = "";

			// shake if error
			this.shakeContainer(this._cntLogin1);
		} else {
			// shake if error
			this.shakeContainer(this._cntLogin2);
		};

		//if (this._loginfail > 5) {
		//};
	},

    shakeContainer: function(cnt)
    {
		// shake if error
		var timeline = this.tweens.createTimeline();
		timeline.add({targets: cnt, x: 0+8,  ease: 'Power1', duration: 40});
		timeline.add({targets: cnt, x: 0-8,  ease: 'Power1', duration: 40});
		timeline.add({targets: cnt, x: 0+6,  ease: 'Power1', duration: 40});
		timeline.add({targets: cnt, x: 0-6,  ease: 'Power1', duration: 40});
		timeline.add({targets: cnt, x: 0+4,  ease: 'Power1', duration: 40});
		timeline.add({targets: cnt, x: 0-4,  ease: 'Power1', duration: 40});
		timeline.add({targets: cnt, x: 0+2,  ease: 'Power1', duration: 40});
		timeline.add({targets: cnt, x: 0-2,  ease: 'Power1', duration: 40});
		timeline.add({targets: cnt, x: 0,    ease: 'Power1', duration: 40});
		timeline.play();
	},

    startDeelnemer: function(data)
    {
		try {
			gameparts = JSON.parse(data);
		} catch (e) {
			gameparts = [{"game": -1, "part": -1}]; //error in the above string(in this case,yes)!
		};

        console.log("startDeelnemer was called!");

		// save participant code
		if (gameparts[0].game == -1) {
			// not a valid deelnemer
			this.errorDeelnemer(-1, "Ongeldig deelnemer nummer");
		} else {
			// valid new deelnemer
			globalvar.studynr = this._strstudynr;
			globalvar.game = gameparts[0].game;
			globalvar.game_part = gameparts[0].part;

			// reset max practice counter for next game
			globalvar.practisecount = 0;

			// update inlog code
			if (this._loginpart == 1) {
				// move to date part
				this._loginpart = 2;
				this._loginfail = 0;
				// move screens
				this.moveScene(this._cntLogin1, MENU_EXIT_LEFT);
				this.moveScene(this._cntLogin2, MENU_ENTER_RIGHT);
			} else {
				// both studynr and gebdat corrent
				if ( (gameparts[0].game >= 4) && (gameparts[0].part >= 4) ) {
					// alles al afgerond
					this.scene.start("gameend");
				} else {
					// continue game at start
					this.scene.start("mainmenu");
				};
				//} else {
				//	// continue game at last part
				//	this.scene.start("gamesave");
				//};
			};
		}
    }
});
