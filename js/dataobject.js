// MultiLang - BdR 2016
// JavaScript object to handle all data
// use global variable for use in all scenes

var CONST_LEFT = 0;
var CONST_RIGHT = 1;

var BACKGROUND_BLUE = '#4a86e8';
var BACKGROUND_BLACK = '#000000';

//var GAME1_REPEAT = 32;
//var GAME2_REPEAT = 32;
//var GAME3_REPEAT = 80;
//var GAME4_REPEAT = 40;
//var GAME1_REPEAT_PRACTISE = 10;
//var GAME2_REPEAT_PRACTISE = 10;
//var GAME3_REPEAT_PRACTISE = 10;
//var GAME4_REPEAT_PRACTISE = 10;

// !! TESTING !!
var GAME1_REPEAT = 4;
var GAME2_REPEAT = 4;
var GAME3_REPEAT = 4;
var GAME4_REPEAT = 4;
var GAME1_REPEAT_PRACTISE = 4;
var GAME2_REPEAT_PRACTISE = 4;
var GAME3_REPEAT_PRACTISE = 4;
var GAME4_REPEAT_PRACTISE = 4;
// !! TESTING !!


var globalvar = {
	dominant: 1, // 0=left hand, 1=right hand
	practise: true,
	game: 1,
	game_part: 1
};

