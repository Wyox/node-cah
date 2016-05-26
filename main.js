var httph = require('./http-handler.js');


// Start webserver handler
httph.init();

// Start websocket handler

var io = require('socket.io')(8080);

console.log("Socket listening on port 8080")

var players = 0;

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

io.on('chat-message', function(msg){
	io.emit('chat-message',msg);
})