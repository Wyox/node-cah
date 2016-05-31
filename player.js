var Player = function(sessionId, playerName){

	// Attributes
	this.sessionId = sessionId;
	this.playerName = playerName;
	this.score = 0;
	this.you = false;
	this.ready = false;
	this.cards = [];
	this.selectedCards = [];


	// Type can be one of the following
	// 1. active-player
	// 2. card-czar
	// 3. unknown (unknown means this player connected but still needs to enter in a name)
	this.type = "unknown";



	// Functions

	this.setPlayerName = function(name){
		this.playerName = name;
	}
	this.getPlayerName = function(){
		return this.playerName;
	}

	this.addSelectedCard = function(item){
		this.selectedCards.push(item);
	}

	this.setSelectedCards = function(selectedCards){
		this.selectedCards = selectedCards;
	}
	this.getSelectedCards = function(){
		return this.selectedCards;
	}

	this.clearSelectedCards = function(){
		this.selectedCards = [];
	}

	this.setSessionId = function(sessionId){
		this.sessionId = name;
	}
	this.getSessionId = function(){
		return this.sessionId;
	}

	this.setReady = function(state){
		this.ready = state;
	}

	this.getReady = function(){
		return this.ready;
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


	this.GetObject = function(){
		// Player to object
		// SessionID is private to this function only

		var myCards = [];
		var mySelectedCards = []

		for(ci in this.selectedCards){
			mySelectedCards.push(this.selectedCards[ci].GetObject());
		}

		for(ci in this.cards){
			myCards.push(this.cards[ci].GetObject());
		}

		// Maybe cards should be put private if they are not yours

		return {
			sessionId : this.sessionId,
			playerName : this.playerName,
			score : this.score,
			you : this.you,
			type : this.type,
			ready : this.ready,
			cards: myCards,
			selectedCards: mySelectedCards
		}
	}


	this.addPoint = function(){
		this.score = this.score + 1;
	}

	this.getScore = function(){
		return this.score;
	}

}

module.exports = Player;