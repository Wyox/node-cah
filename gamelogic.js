var Player = require('./Player.js');
var GameInfo = require('./GameInfo.js');
var CardSet = require('./cardsets/CardSet.js');
var card = require('./cardsets/card.js');

var io;
var players = 0;
var PlayerArray = [];
var myGameInfo = new GameInfo(PlayerArray);
var myCardSet = new CardSet();
var czarIndex = 0;


exports.init = function(ioo){

	io = ioo;

	// Hook once a player connects
	// Also sets all the hooks after a player is connected
	io.on('connection', function(socket){
		//
		console.log(("Game: Player connected (" + socket.id + ")").green);

		var myPlayer = new Player(socket.id);
		PlayerArray.push(myPlayer);


		socket.on('disconnect', function(){
			console.log(("Game: Player disconnected (" + socket.id + ")").red);
			indexOfPlayer = getIndexBySessionId(socket.id);
			// Remove player from list
			PlayerArray.splice(indexOfPlayer, 1);
			SyncGameInfo();

		});


		// Custom events

		// Player wants to set his playername
		socket.on('SetPlayerName', function(name){

			// Find the current player with our current socket.id
			var myPlayer = findPlayerBySessionId(socket.id);

			// Set the current player's name
			myPlayer.setPlayerName(name);

			// Also flag is as active since he changed his/her name
			myPlayer.setActivePlayer();

			// Sync info
			SyncGameInfo();

		});


		// Player wants to change his own ready state
		socket.on('SetReadyState', function(state){

			// Find the current player with our current socket.id
			var myPlayer = findPlayerBySessionId(socket.id);

			// Change the ready state
			myPlayer.setReady(state);


			// Do some logic to define if a game-start event should be triggered from this
			var totalReady = 0;

			// Loop across all players
			for( pli in myGameInfo.players ){
				// Count all the players that are ready
				if(myGameInfo.players[pli].ready === true){
					totalReady = totalReady + 1;
				}
			}

			console.log("Game: Waiting for players ",totalReady,"/",myGameInfo.players.length)

			// We require a minimum of 3 players or more. All players also need to have the flag that they are ready
			if(myGameInfo.players.length >= 3 && totalReady == myGameInfo.players.length){
				// Start game
				if(myGameInfo.IsWaitingForPlayers() === true){
					// Trigger GameStart event
					GameStart();
					return;
				}
			}
		
			// Sync game info to make sure other players know about who is ready
			SyncGameInfo();

		})

		// Player wants to pick a white-card
		socket.on('SetCard',function(card){

			// Find the current player
			var currentPlayer = findPlayerBySessionId(socket.id);

			// Add the selected card to the selectedCard stack
			currentPlayer.addSelectedCard(myCardSet.getCardById(card));

			// Counters
			var countCards = 0;
			var countPlayers = 0;

			// Check if all players picked a card (except the card czar). If so go to the card czar pick
			for( pli in myGameInfo.players ){

				// The player who is picking the cards is ready and is not the card-czar
				if(myGameInfo.players[pli].ready === true && myGameInfo.players[pli].isCardCzar() === false){
					countPlayers = countPlayers + 1;
					countCards = countCards + myGameInfo.players[pli].selectedCards.length;
				}
			}

			// Everyone did his/her job. It's time for the card czar
			if(countCards >= (countPlayers * myGameInfo.getBlackCard().numanswers)){
				console.log("Game: All players picked white cards. Go to czar pick")
				GameCardCzarPick();
				return;
			}


			SyncGameInfo();

		})

		// Card czar picked the winning player
		socket.on('SetWinnerRound',function(sessionId){

			// Find the player by the given session ID
			var winningPlayer = findPlayerBySessionId(sessionId);

			// Check if it's not empty and NOT triggered multiple times.
			if(winningPlayer != null && winningPlayer.getWon() == false){
				// Add a point to the player
				winningPlayer.addPoint();

				// Set the fact he has won
				winningPlayer.setWon(true);
			}

			// Remove player cards that has been played
			for( pli in myGameInfo.players ){
				var myPlayer = myGameInfo.players[pli];
				var mySelectedCards = myPlayer.getSelectedCards();

				var myNewCards = [];
				var myCards = myPlayer.getCards();

				for(cii in myCards){
					var curCard = myCards[cii];

					var canAdd = true;
					for(ci in mySelectedCards){
						var mySelectedCard = mySelectedCards[ci];

						if(mySelectedCard.id == curCard.id){
							var canAdd = false;
							break;
						}	
					}

					if(canAdd == true){
						myNewCards.push(curCard);
					}
				}

				myPlayer.cards = myNewCards;

			}



			myGameInfo.SetRoundEnd();
			SyncGameInfo();
			setTimeout(GameStart,5500);
		}); 


		//Initial call, sync the current game info to that player
		SyncGameInfo();


	});

}

function GameStart(){
	console.log("Game: Change to start game");
	myGameInfo.SetStartGame();

	// Note, this code is deliberatly put in different for loops to keep the code quite straight-forward
	// It will affect performance by a bit but since we don't deal with loads of data this performance hit is too small to be noticable

	// Reset all the player attributes

	for( pli in myGameInfo.players ){
		var myPly = myGameInfo.players[pli];
		myPly.setWon(false);
		myPly.clearSelectedCards();
	}	

	// Define a card-czar
	var foundCZar = false

	// Loop across all players
	for( pli in myGameInfo.players ){

		// Is one of them already a card czar
		if(myGameInfo.players[pli].isCardCzar() === true){
			// Never exceed the player count but add one to the index
			// set the czar index + 1 but make sure not to exceed the myGameInfo.players.length limit.
			// Reset the czar status
			myGameInfo.players[pli].setActivePlayer();			
			czarIndex = (czarIndex + 1) %  myGameInfo.players.length;
			break;
		}
	}

	// Set a czar
	myGameInfo.players[czarIndex].setCardCzar();

	// Pick a random black card
	myGameInfo.setBlackCard(myCardSet.drawBlackCard());


	// Check if everyone has 10 cards and reset selected cards
	for( pli in myGameInfo.players ){
		var myPly = myGameInfo.players[pli];
		myPly.clearSelectedCards();
		while(myPly.cards.length < 10){
			myPly.cards.push(myCardSet.drawWhiteCard());
		}
	}
	// Sync information
	SyncGameInfo();


	// Wait 1 second to change mode
	setTimeout(GamePlayerPick, 250);
	
}

function GamePlayerPick(){
	myGameInfo.SetPlayerPick();
	SyncGameInfo();
}

function GameCardCzarPick(){
	myGameInfo.SetCzarPick();
	SyncGameInfo();
}


function SyncGameInfo(){
	var gameLog = 
	console.log(("Game: Syncing game info to " + PlayerArray.length + " player(s)").green);

	for (i in PlayerArray) {
		//Tmp put it on you so the current player is distinguised between clients
		myGameInfo.players[i].you = true;

		// Send the gameinfo packet
		io.to(PlayerArray[i].getSessionId()).emit('GameInfoUpdate',myGameInfo.GetObject());

		//Tmp put it on you so the current player is distinguised between clients
		myGameInfo.players[i].you = false;
	}

	return;
}

function findPlayerBySessionId(sessionId){
	var myPlayer = new Player();

	var myIndex = getIndexBySessionId(sessionId);

	if(myIndex >= 0){
		return PlayerArray[myIndex];
	}else{
		return null;
	}
}


function getIndexBySessionId(sessionId){
	var index = -1;
	for (var i = 0; i<PlayerArray.length;i++) {
		if(PlayerArray[i].sessionId == sessionId){
			index = i;
			break;
		}
	}

	return index;


}
