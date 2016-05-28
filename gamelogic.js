var Player 	= require('./Player.js');
var GameInfo 	= require('./GameInfo.js');

var io;
var players = 0;
var PlayerArray = [];
var myGameInfo = new GameInfo(PlayerArray);

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
					console.log("Game: Change to start game");
					myGameInfo.SetStartGame();
				}
			}else{
				console.log("Game: Waiting for players ",totalReady,"/",myGameInfo.players.length)
			}

			SyncGameInfo();

		})		

		//Initial call, sync the current game info to that player
		SyncGameInfo();


	});

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