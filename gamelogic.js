var io = {};


exports.init = function(io){

	io.on('connection', function(socket){
		var players = players + 1;
		console.log('a user connected');

		socket.on('disconnect', function(){
			players = players - 1;
			if(players <= 0){
				players = 0;
			}

			console.log('user disconnected');
		});
	});




}

