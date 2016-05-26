var Player = function(sessionId, playerName, score){

	// Attributes
	this.sessionId = sessionId;
	this.playerName = playerName;
	this.score = score;



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


}

module.exports = Player;