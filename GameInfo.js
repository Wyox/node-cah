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
	this.blackcard;

	this.getBlackCard = function(){
		return this.blackcard;
	}

	this.setBlackCard = function(blackcard){
		this.blackcard = blackcard;
	}


	this.IsStartGame = function(){
		return (this.state == "start-game");
	}

	this.IsPlayerPick = function(){
		return (this.state == "player-pick");
	}

	this.IsCzarPick = function(){
		return (this.state == "czar-pick");
	}

	this.IsRoundEnd = function(){
		return (this.state == "round-end");
	}

	this.IsWaitingForPlayers = function(){
		return (this.state == "waiting-for-players");
	}

	this.SetStartGame = function(){
		this.state="start-game";
	}

	this.SetPlayerPick = function(){
		this.state="player-pick";
	}

	this.SetCzarPick = function(){
		this.state="czar-pick";
	}

	this.SetRoundEnd = function(){
		this.state="round-end";
	}


	this.GetObject = function(){

		var myPlayers = [];

		for(pli in this.players){
			myPlayers.push(this.players[pli].GetObject());
		}

		// Return an object back with just the info
		return {
			players: myPlayers,
			state: this.state,
			blackcard: this.blackcard
		}

	}

}

module.exports = GameInfo;
