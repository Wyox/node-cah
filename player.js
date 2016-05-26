var Player = function(sessionId, playerName, score){

	// Attributes
	this.sessionId = sessionId;
	this.playerName = playerName;
	this.score = score;

	// active-player or card-czar
	this.type = "active-player";


	// Functions

	this.setPlayerName = function(name){
		this.playerName = name;
	}
	this.getPlayerName = function(){
		return this.playerName;
	}

	this.setSessionId = function(sessionId){
		this.sessionId = name;
	}
	this.getSessionId = function(){
		return this.sessionId;
	}

	this.setCardCzar = function(){
		this.type = "card-czar";
	}

	this.setActivePlayer = function(){
		this.type = "active-player";
	}

	// Player that is able to judge the cards, but not able to play the cards
	this.isCardCzar = function(){
		if(this.type == "card-czar"){
			return true;
		}else{
			return false;
		}
	}

	// Player that is allowed to play cards
	this.isActivePlayer = function(){
		if(this.type == "active-player"){
			return true;
		}else{
			return false;
		}
	}


}

module.exports = Player;