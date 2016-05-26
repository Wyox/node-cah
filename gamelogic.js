var Player 	= require('./Player.js');

var io = {};
var players = 0;

var PlayerArray = [];

exports.init = function(io){

	io.on('connection', function(socket){
		players = PlayerArray.length;

		var myPlayer = new Player(socket.id);
		PlayerArray.push(myPlayer);

		socket.on('disconnect', function(){
			indexOfPlayer = getIndexBySessionId(socket.id);
			// Remove player from list
			PlayerArray.splice(indexOfPlayer, 1);

		});

		socket.on('SetPlayerName', function(name){
			var myPlayer = findPlayerBySessionId(socket.id);			
			myPlayer.setPlayerName(name);
		})

	});

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