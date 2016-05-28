var Card = function(id,cardType,text,expansion){
	this.id = id;
	this.cardType = cardType;
	this.text = text;
	this.expansion = expansion;	


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


};

module.exports = Card;