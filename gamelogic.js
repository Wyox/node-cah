var Player 	= require('./Player.js');
var GameInfo 	= require('./GameInfo.js');

var io = {};
var players = 0;
var PlayerArray = [];
var myGameInfo = new GameInfo(PlayerArray);

exports.init = function(io){

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

		});


		// Custom events
		socket.on('SetPlayerName', function(name){
			console.log("Game: Player set name to '" + name + "'");
			var myPlayer = findPlayerBySessionId(socket.id);			
			// Since we work with pointers, elements in PlayerArray are updated ;)
			myPlayer.setPlayerName(name);

		})





	});

}



function SyncGameInfo(GameInfo){

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