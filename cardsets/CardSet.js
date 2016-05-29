var fs = require('fs');
var CardObj = require("./card.js")

var simpleJSONFilter = require('simple-json-filter');

//Load all cards into server memory
global.obj = JSON.parse(fs.readFileSync('./cardsets/cards.json', 'utf8'));

//Load the Simple jSON filter Module
var sjf = new simpleJSONFilter();

var CardSet = function(expansions){
	this.usedCards = {};

	// expansions is an array with expansions. if it's empty pick the default set

	if(expansions != null){
		this.expansions = expansion;
	}else{
		this.expansions = ['Base','CAHe1'];
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

	this.getCardById = function(id){
		var filter = {id: id};
		var foundResults = sjf.wantArray().exec(filter,global.obj);


		if(foundResults.length > 0){
			return new CardObj(foundResults[0].id,foundResults[0].cardType,foundResults[0].text,foundResults[0].expansion,foundResults[0].numAnswers);
		}else{
			return;
		}
		

		return 
	}

	//Returns the amount of available white cards, using filter
	this.availableBlackCards = function(){
		expansion = this.expansions;
		var filter = {cardType: "Q"};
		var foundResults = sjf.wantArray().exec(filter,global.obj);
		return Object.keys(foundResults).length;
	}

	//Returns the amount of available white cards, using filter
	this.availableWhiteCards = function(){
		expansion = this.expansions;
		var filter = {cardType: "A"};
		var foundResults = sjf.exec(filter,global.obj);
		return Object.keys(foundResults).length;
	}

	//Returns a black card for the game
	this.drawBlackCard = function(){
		//Define max for choosing random card
		var max = this.availableBlackCards();

		//Choose random number


		//Execute filter
		var filter = {cardType: "Q"};
		var foundResults = sjf.wantArray().exec(filter,global.obj);

		var test = Math.floor(Math.random() * (foundResults.length - 1 + 1)) + 1;

		//Return the card
		console.log("Returning black card with id "+test+ ". Contents: " + foundResults[test] + ". Amount of black cards left: " + max);
		return new CardObj(foundResults[test].id,foundResults[test].cardType,foundResults[test].text,foundResults[test].expansion,foundResults[test].numAnswers);
	}

	//Returns a white card for the game
	this.drawWhiteCard = function(){
		//Define max for choosing random card
		var max = this.availableWhiteCards();

		//Choose random number

		//Execute filter
		var filter = {cardType: "A"};
		var foundResults = sjf.wantArray().exec(filter,global.obj);

		var test = Math.floor(Math.random() * (foundResults.length - 1 + 1)) + 1;


		//Return the card
		console.log("Returning white card with id "+test+ ". Contents: " + foundResults[test] + ". Amount of white cards left: " + max);
		return new CardObj(foundResults[test].id,foundResults[test].cardType,foundResults[test].text,foundResults[test].expansion,foundResults[test].numAnswers);
	}



}


module.exports = CardSet;