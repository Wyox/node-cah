var Player = require('./Player.js');
var GameInfo = require('./GameInfo.js');
var CardSet = require('./cardsets/CardSet.js');
var card = require('./cardsets/card.js');

var io;
var players = 0;
var PlayerArray = [];
var myGameInfo = new GameInfo(PlayerArray);
var myCardSet = new CardSet();



exports.init = function(ioo){

	io = ioo;

	io.on('connection', function(socket){
		players = PlayerArray.length;

		console.log("Game: Player connected");

		var myPlayer = new Player(socket.id);
		PlayerArray.push(myPlayer);

		socket.on('disconnect', function(){
			console.log("Game: Player disconnected");
			indexOfPlayer = getIndexBySessionId(socket.id);
			// Remove player from list
			PlayerArray.splice(indexOfPlayer, 1);
			SyncGameInfo();

		});


		// Custom events
		socket.on('SetPlayerName', function(name){
			console.log("Game: Player set name to '" + name + "'");
			var myPlayer = findPlayerBySessionId(socket.id);
			// Since we work with pointers, elements in PlayerArray are updated ;)
			myPlayer.setPlayerName(name);
			myPlayer.setActivePlayer();
			SyncGameInfo();

		})

		socket.on('SetReadyState', function(state){
			console.log("Game: Player set ready-state to '" + state + "'");
			var myPlayer = findPlayerBySessionId(socket.id);
			// Since we work with pointers, elements in PlayerArray are updated ;)
			myPlayer.setReady(state);


			// Do logic once everyone is ready
			var totalReady = 0;
			for( pli in myGameInfo.players ){
				if(myGameInfo.players[pli].ready === true){
					totalReady = totalReady + 1;
				}
			}
			if(myGameInfo.players.length >= 3 && totalReady == myGameInfo.players.length){

				// Start game
				if(myGameInfo.IsWaitingForPlayers() === true){
					GameStart();
				}
			}else{
				console.log("Game: Waiting for players ",totalReady,"/",myGameInfo.players.length)
			}

			SyncGameInfo();

		})

		socket.on('SetCard',function(card){
			// Remove the set card from the players card stack.
			var currentPlayer = findPlayerBySessionId(socket.id);

			currentPlayer.addSelectedCard(myCardSet.getCardById(card));

			var countCards = 0;
			var countPlayers = 0;
			// Check if all players picked a card (except the card czar). If so go to the card czar pick
			for( pli in myGameInfo.players ){
				if(myGameInfo.players[pli].ready === true && myGameInfo.players[pli].isCardCzar() === false){
					countPlayers = countPlayers + 1;
					countCards = countCards + myGameInfo.players[pli].selectedCards.length;
				}
			}

			if(countCards >= (countPlayers * myGameInfo.getBlackCard().numanswers)){
				console.log("Game: All players picked white cards. Go to czar pick")
				GameCardCzarPick();
			}


			SyncGameInfo();

		})

		socket.on('SetWinnerRound',function(sessionId){
			// Find the player with this session id and add a point to his score.
			var winningPlayer = findPlayerBySessionId(sessionId);

			// Check if it's not empty and NOT triggered multiple times.
			if(winningPlayer != null && winningPlayer.getWon() == false){
				// Add a point to the player
				winningPlayer.addPoint();
				winningPlayer.setWon(true);
			}

			myGameInfo.SetRoundEnd();
			SyncGameInfo();
			setTimeout(GameStart,10000);
		}); 


		//Initial call, sync the current game info to that player
		SyncGameInfo();


	});

}

function GameStart(){
	console.log("Game: Change to start game");
	myGameInfo.SetStartGame();

	// Set a card-czar
	var foundCZar = false
	var czarIndex = 0;
	for( pli in myGameInfo.players ){
		if(myGameInfo.players[pli].isCardCzar() === true){
			// Never exceed the player count but add one to the index
			myGameInfo.players[pli].setActivePlayer();
			czarIndex = (pli + 1) %  myGameInfo.players.length;
			break;
		}
	}

	myGameInfo.players[pli].setCardCzar();

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

	setTimeout(GamePlayerPick, 1000);
	
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
