var Player = function(sessionId, playerName, score){
	this.sessionId = sessionId;
	this.playerName = playerName;
	this.score = score;

	this.setPlayerName = function(name){
		this.playerName = name;
	}
	this.getPlayerName = function(name){
		return this.playerName;
	}

}

module.exports = Player;