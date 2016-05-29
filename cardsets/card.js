var Card = function(id,cardType,text,expansion,numanswers){
	this.id = id;
	this.cardType = cardType;
	this.text = text;
	this.expansion = expansion;	
	this.numanswers = numanswers


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

	this.GetObject = function(){
		return {
			id: this.id,
			cardType: this.cardType,
			text: this.text,
			expansion: this.expansion,
			numanswers: this.numanswers
		}
	}

	this.getNumAnswers = function(){
		return this.numanswers;
	}


};

module.exports = Card;