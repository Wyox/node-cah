var Card = function(id,cardType,text,expansion){
	this.id = id;
	this.cardType = cardType;
	this.text = text;
	this.expansion = expansion;	
};

Card.prototype.getType = function(){
	return this.type;
}