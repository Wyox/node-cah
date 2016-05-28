var fs = require('fs');


var CardSet = function(expansions){
	// Load cardsets into memory

	// expansions is an array with expensions. if it's empty pick the default set

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


	function LoadCards(){
		var obj = JSON.parse(fs.readFileSync('cards.json', 'utf8'));
	}

};





module.exports = CardSet;