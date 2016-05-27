var GameInfo = function(players){
	this.players = players;

	// Valid states
	/*
		1. waiting-for-players
		2. start-game
		3. player-pick
		4. czar-pick
		5. round-end
	*/ 

	this.state = "waiting-for-players";

}

module.exports = GameInfo;