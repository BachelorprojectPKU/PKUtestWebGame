// Bachelor project (afstudeerproject)
// Bas de Reuver (c)2020

var rungame = {};

// =============================================================================
// intro state
// =============================================================================
rungame.Intro = function(anttest) {
	this.anttest = anttest;
	this.demotimer = null;
	this.democount;
	
	this.demospawn;
}
rungame.Intro.prototype = {
	init: function(){
		// startup clear all
		document.getElementById("mainintro").style.display = "inherit";

		document.getElementById("btnstart").onclick = this.press.bind(this);
	},
	
	close: function() {
		document.getElementById("mainintro").style.display = "none";
	},

	update: function() {

	},

	press: function(btn) {
		// show highscore before starting game
		this.anttest.state.start("menu");
	}
}


// =============================================================================
// main menu state
// =============================================================================
rungame.Menu = function(anttest) {
	this.anttest = anttest;
}
rungame.Menu.prototype = {
	init: function(){
		// startup clear all
		document.getElementById("mainmenu").style.display = "inherit";

		document.getElementById("btngame1").onclick = this.press.bind(this);
		document.getElementById("btngame2").onclick = this.press.bind(this);
		document.getElementById("btngame3").onclick = this.press.bind(this);
		document.getElementById("btngame4").onclick = this.press.bind(this);
		document.getElementById("btnscore").onclick = this.press.bind(this);
	},
	
	close: function() {
		document.getElementById("mainmenu").style.display = "none";
	},

	update: function() {
	},
	
	press: function(evt) {
		// start game 1..4
		var gamenr = evt.target.id;
		gamenr = parseInt(gamenr.substr(gamenr.length - 1));

		// just check to be safe
		if ( (gamenr >= 1) && (gamenr <= 4) ) {
			this.anttest.gameReset(gamenr);
			this.anttest.state.start("tutorial");
			//this.anttest.state.start("game"+gamenr);
		} else {
			this.anttest.state.start("scores");
		};
	},
}

// =============================================================================
// spel uitleg state
// =============================================================================
rungame.Tutorial = function(anttest) {
	this.anttest = anttest;
}
rungame.Tutorial.prototype = {
	init: function(){
		// startup clear all
	
		// which tutorial text
		var txt = "Tutorial text not found.";
		switch(this.anttest.gamenr) {
			case 1:
				txt = "We gaan eens kijken hoe snel je kunt reageren. Op het scherm zie je straks in het midden een kruisje. Dat ziet er zo uit [Instruct]. Daar moet je goed naar kijken want dat kruisje verandert onverwachts in een blokje. Dat blokje ziet er zo uit [Spatiebalk]. Als dat gebeurt druk je zo snel mogelijk met je wijsvinger op het knopje. Het blokje verandert dan meteen in een kruisje [Spatiebalk]. Blijf daarnaar kijken want het kan plotseling weer veranderen in een blokje. Op dat moment moet je weer zo snel mogelijk op het knopje drukken. *Let op dat je alleen op het knopje drukt als het blokje er echt is, en niet op het moment dat je denkt dat het blokje zal komen.*\n\n*--Practice--*\nWe gaan dit eerst oefenen. Is het duidelijk? Je linker wijsvinger is aan de beurt. Leg je linker wijsvinger op het linker knopje, en leg je andere hand maar op tafel. Opgelet.... *[Practice]* Test Nu komt de echte test, waarin je hetzelfde moet doen. Opgelet...*[Test]*";
				break;
			case 2:
				txt = "Hier zie je een balk met een gekleurd blokje [Instruct]. Dit blokje kan van plaats veranderen. Kijk maar. In dit gedeelte moet je het blokje volgen: als het blokje naar links sprong, druk je op de *linkerknop*, als het blokje naar rechts sprong, druk je op de rechterknop.\n\nPractice We gaan eerst oefenen. Zijn er nog vragen? Leg de wijsvingers op de knoppen. Probeer zo snel mogelijk te werken zonder fouten te maken. Opgelet ...[Practice]. Test Nu komt de echte test waarin je hetzelfde moet doen. Wijsvingers op de knoppen. Probeer zo snel mogelijk te werken zonder fouten te maken. Opgelet... [Test].";
				break;
			case 3:
				txt = "Hier zie je een plaatje met negen blokjes [Instruct]. Drie daarvan zijn rood, de anderen zijn wit. Zoals je kunt zien, staan de rode blokjes op een bepaalde plaats (wijs aan). Straks zie je telkens vier van dit soort plaatjes waarin de rode blokjes op dezelfde plaats staan of ergens anders, of plaatjes waarin minder rode blokjes staan. We willen graag weten hoe goed en hoe snel je dit plaatje kunt herkennen. De bedoeling is dat je op de ja-knop drukt als je precies zo'n plaatje ziet. Als je dit plaatje niet ziet, dan moet je op de nee-knop drukken.\n\nPractice\nWe gaan eerst oefenen. Zijn er nog vragen? Leg wijsvingers op de knoppen. Probeer zo snel mogelijk te werken zonder fouten te maken. Opgelet ...[Practice] Test Nu komt de echte test waarin je hetzelfde moet doen (herhaal eventueel instructie), wijsvingers op de knoppen. Probeer zo snel mogelijk te werken zonder fouten te maken. Opgelet... [Test].";
				break;
			case 4:
				txt = "Instructie\nWe willen weten hoe goed en hoe snel je aan de uitdrukking op een gezicht kunt zien hoe iemand zich voelt (bv. blij, boos, verdrietig, enz.). In dit deel gaat het om Blij [Instruct]. Hier zie je iemand die blij kijkt. Straks zie je achter elkaar foto's van mannen en vrouwen en je moet nagaan of zij ook blij kijken. Als dat zo is, dan druk je op de ja-knop, als dat niet zo is dan druk je op de nee-knop. <Spatiebalk> Kijkt dit gezicht blij?, en dit ? <Spatiebalk>.";
				break;
		};

		// set tutorial text
		var txttut = document.getElementById("tutorialtext");
		txttut.innerHTML = txt;
		
		// show div and set click event
		document.getElementById("tutorial").style.display = "inherit";
		document.getElementById("btntutor").onclick = this.press.bind(this);
	},
	
	close: function() {
		document.getElementById("tutorial").style.display = "none";
	},

	update: function() {
	},
	
	press: function(evt) {
		// start game 1..4
		var game = "game" + this.anttest.gamenr;
		this.anttest.state.start(game);
	}
}

// =============================================================================
// game 1 state
// =============================================================================
rungame.Game1 = function(anttest) {
	this.anttest = anttest;

	// gui variables
	this.backbutton;
	this.sprite1;

	// variables
	this.waitstate;
	this.timeswitch;
	this.countreset;
	this.scores;
}
rungame.Game1.prototype = {
	init: function(){
		// set up back button
		this.backbutton = document.getElementById("btnback1");
		this.backbutton.onclick = this.press.bind(this);
		this.backbutton.style.display = "none";
		
		this.sprite1 = document.getElementById("block_1");

		// startup clear all
		document.getElementById("game1").style.display = "inherit";

		// start timer
		this.countreset = 0;
		this.scores = [];
		this.timer = this.anttest.addtimer(this, this.ontimer, 1000, true);
		this.resetCross();
	},
	
	close: function() {
		document.getElementById("game1").style.display = "none";
	},

	update: function() {
	},
	
	press: function(btn, idx) {
		// show highscore before starting game
		this.anttest.state.start("menu");
	},

	keypress: function(idx) {
		// show highscore before starting game
		console.log("game 1 -- press" + idx);
		
		// check if square has appeared
		if (this.waitstate == 1) {
			var timeend = new Date();
			//var sec = Math.floor((timeend - this.anttest.playtimestart) / 1000); // round to seconds
			var sec = (timeend - this.timeswitch) / 1000; // do not round
			this.anttest.debugText("key press sec=" + sec);

			// keep scores
			debugger;
			this.scores[this.countreset-1] = sec;

			// restart
			this.resetCross();
		} else {
			// square has not appeared
			this.anttest.debugText("Te vroeg!! wacht nog even..");
		};
	},

	resetCross: function() {
		// reset on screen
		this.anttest.addRemoveClass("block_1", "cross", "square"); // add cross, remove square

		// reset variable
		this.waitstate = 0;

		if (this.countreset < 5) {
			// count how many
			this.countreset++;
			// start timer
			var rnd = this.anttest.randomInteger(2000, 5000);
			this.timer.interval = rnd;
			this.timer.start();
		} else {
			// save sacores
			debugger;
			this.anttest.scores.newResult(1, this.scores);

			// back to menu
			this.anttest.state.start("menu");
		};
	},

	ontimer: function(tmr) {
		// show highscore before starting game
		console.log("game 1 -- timer " + tmr.counter);

		// toggle 0..1 show or reset
		this.waitstate = 1 - this.waitstate;

		// 1 = square appears
		if (this.waitstate == 1) {
			this.anttest.addRemoveClass("block_1", "square", "cross"); // add square, remove cross
			this.timer.pause();

			// save timestamp when appears
			this.timeswitch = new Date();
		};
	},
}

// =============================================================================
// game 2 state
// =============================================================================
rungame.Game2 = function(anttest) {
	this.anttest = anttest;
	this.backbutton;

	this.gamepart;
	this.blockpos; // current position 1..10
	this.blockcolor; // 0=green, 1=red

	this.timer;
	this.waitstate;
	this.countstep;
	this.laststep; // 0=left, 1=right
	this.timestep;
}
rungame.Game2.prototype = {
	init: function(){
		// set up back button
		this.backbutton = document.getElementById("btnback2");
		this.backbutton.onclick = this.press.bind(this);
		this.backbutton.style.display = "none";

		// reset all blocks to grey
		for (var i=1; i <= 10; i++) {this.refreshBlock(i, -1);}
		
		// startup clear all
		document.getElementById("game2").style.display = "inherit";

		// new timer
		this.timer = this.anttest.addtimer(this, this.ontimer, 1000, true);

		// reset variables
		this.blockpos = 5;
		this.countstep = 0;
		this.blockcolor = 0; // green
		
		// initialise block and wait
		this.refreshBlock(this.blockpos, this.blockcolor);
		this.waitRandom();
	},
	
	close: function() {
		document.getElementById("game2").style.display = "none";
	},

	update: function() {
	},
	
	press: function(btn, idx) {
		// show highscore before starting game
		this.anttest.state.start("menu");
	},
	
	keypress: function(idx) {
		// show highscore before starting game
		console.log("game 2 -- press" + idx);
	

		// check if square has appeared
		if (this.waitstate == 1) {
			var timeend = new Date();
			//var sec = Math.floor((timeend - this.anttest.playtimestart) / 1000); // round to seconds
			var sec = (timeend - this.timestep) / 1000; // do not round
			var cor = 1;
			this.anttest.debugText("key press sec=" + sec + " correct=" + cor);
			
			// wait for next step
 			this.waitRandom();
		} else {
			// square has not appeared
			this.anttest.debugText("Te vroeg!! wacht nog even..");
		};
	},

	refreshBlock: function(pos, blk) {
		// current block color
		var clr = (blk >= 0 ? (blk == 0 ? "green" : "red") : "lgrey");

		// reset current block
		this.anttest.addRemoveClass(("block_2_"+pos), clr, ["green", "red", "lgrey"]); // add cross, remove green/red
	},

	ontimer: function(tmr) {
		// show highscore before starting game
		console.log("game 2 -- timer " + tmr.counter);

		// puase for now
		this.timer.pause();
		
		// reset current postion to light-grey
		this.refreshBlock(this.blockpos, -1);
		
		// decide next step, left or right
		this.laststep = (this.anttest.randomInteger(0, 1) == 0 ? -1 : +1);
		if (this.blockpos ==  1) this.laststep = +1; // left most, can only move right
		if (this.blockpos == 10) this.laststep = -1; // right-most, can only move left
		
		// move left or right
		this.blockpos = this.blockpos + this.laststep;
		
		// set current postion to color
		this.refreshBlock(this.blockpos, this.blockcolor);

		// save timestamp when step
		this.timestep = new Date();
		this.waitstate = 1;
	},
	
	waitRandom: function() {
		
		// no keypress while waiting 
		this.waitstate = 0;
		
		// wait next random step
		if (this.countstep < 5) {
			// count how many
			this.countstep++;
			// start timer
			//var rnd = this.anttest.randomInteger(2000, 5000);
			//this.timer.interval = rnd;
			this.timer.interval = 1500;
			this.timer.start();
		} else {
			// start timer
			this.anttest.state.start("menu");
		};
	},
}

// =============================================================================
// game 3 state
// =============================================================================
rungame.Game3 = function(anttest) {
	this.anttest = anttest;
	this.backbutton;
}
rungame.Game3.prototype = {
	init: function(){
		// set up back button
		this.backbutton = document.getElementById("btnback3");
		this.backbutton.onclick = this.press.bind(this);
		this.backbutton.style.display = "none";

		// startup clear all
		document.getElementById("game3").style.display = "inherit";
	},
	
	close: function() {
		document.getElementById("game3").style.display = "none";
	},

	update: function() {
	},
	
	press: function(btn, idx) {
		// show highscore before starting game
		this.anttest.state.start("menu");
	},
}

// =============================================================================
// game 4 state
// =============================================================================
rungame.Game4 = function(anttest) {
	this.anttest = anttest;
	this.backbutton;
}
rungame.Game4.prototype = {
	init: function(){
		// set up back button
		this.backbutton = document.getElementById("btnback4");
		this.backbutton.onclick = this.press.bind(this);
		this.backbutton.style.display = "none";

		// startup clear all
		document.getElementById("game4").style.display = "inherit";
	},
	
	close: function() {
		document.getElementById("game4").style.display = "none";
	},

	update: function() {
	},
	
	press: function(btn, idx) {
		// show highscore before starting game
		this.anttest.state.start("menu");
	},
}



// =============================================================================
// scores results state
// =============================================================================
rungame.Scores = function(anttest) {
	this.anttest = anttest;
	this.backbutton;
}
rungame.Scores.prototype = {
	init: function(){
		// set up back button
		this.backbutton = document.getElementById("btnback5");
		this.backbutton.onclick = this.press.bind(this);
		
		// show scores on screen
		this.anttest.scores.refreshHTML();

		// startup clear all
		document.getElementById("scores").style.display = "inherit";
	},

	refreshResults: function () {
		// update names and scores in highscore table
		for (var i = 0; i < HIGHSCORE_LENGTH; i++) {
			$('#highscores tr:nth-child('+(i+2)+') td:nth-child(2)').text(finddiff.highscores[i].name);
			$('#highscores tr:nth-child('+(i+2)+') td:nth-child(3)').text(finddiff.highscores[i].score);
		};
		// NOTE: don't replace html as this screws up the layout because of the updated CSS
		//$('#highscores table').html(html);
	},
	
	
	close: function() {
		document.getElementById("scores").style.display = "none";
	},

	update: function() {
	},
	
	press: function(btn, idx) {
		// show highscore before starting game
		this.anttest.state.start("menu");
	},
}

