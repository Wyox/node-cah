var fs = require('fs');
var simpleJSONFilter = require('simple-json-filter');

//Load all cards into server memory
global.obj = JSON.parse(fs.readFileSync('./cardsets/cards.json', 'utf8'));

//Load the Simple jSON filter Module
var sjf = new simpleJSONFilter();

var CardSet = function(expansions){
	// expansions is an array with expansions. if it's empty pick the default set

	if(expansions != null){
		this.expansions = expansion;
	}else{
		this.expansions = ['Base','CAHe1'];
	}
}

this.getType = function(){
	return this.type;
}

this.getText = function(){
	return this.text;
}

this.getExpansion = function(){
	return this.expansion;
}

this.getId = function(){
	return this.id;
}

//Returns the amount of available white cards, using filter
function availableBlackCards(){
	expansion = this.expansions;
	var filter = {cardType: "Q"};
	var foundResults = sjf.exec(filter,global.obj);
	return Object.keys(foundResults).length;
}

//Returns the amount of available white cards, using filter
function availableWhiteCards(){
	expansion = this.expansions;
	var filter = {cardType: "A"};
	var foundResults = sjf.exec(filter,global.obj);
	return Object.keys(foundResults).length;
}

//Returns a black card for the game
function drawBlackCard(){
	//Define max for choosing random card
	var max = availableBlackCards();

	//Choose random number
	var test = Math.floor(Math.random() * (max - 1 + 1)) + 1;

	//Execute filter
	var filter = {cardType: "A", id: test};
	var foundResults = sjf.exec(filter,global.obj);

	//Return the card
	console.log("Returning black card with id "+test+ ". Contents: " + foundResults + ". Amount of black cards left: " + max);
	return Object.keys(foundResults).length;
}

//Returns a black card for the game
function drawWhiteCard(){
	//Define max for choosing random card
	var max = availableWhiteCards();

	//Choose random number
	var test = Math.floor(Math.random() * (max - 1 + 1)) + 1;

	//Execute filter
	var filter = {cardType: "A", id: test};
	var foundResults = sjf.exec(filter,global.obj);

	//Return the card
	console.log("Returning black card with id "+test+ ". Contents: " + foundResults + ". Amount of black cards left: " + max);
	return Object.keys(foundResults).length;
}

module.exports = CardSet;
module.exports.drawBlackCard = drawBlackCard();
module.exports.drawBlackCard = drawWhiteCard();
