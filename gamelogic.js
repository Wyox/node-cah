var Player 	= require('./Player.js');

var io = {};
var players = 0;

var PlayerArray = [];

exports.init = function(io){

	io.on('connection', function(socket){

		players = players + 1;
		console.log('a user connected');

		var myPlayer = new Player(socket.id);

		myPlayer.setPlayerName("Ivo speelt vals");
		PlayerArray.push(myPlayer)


		console.log(PlayerArray);
		socket.on('disconnect', function(socket){
			players = players - 1;

			if(players <= 0){
				players = 0;
			}

			console.log('user disconnected');

		});

	});





}




function startGame(){



}