var httph = require('./http-handler.js');


// Start webserver handler
httph.init();

// Start websocket handler

var io = require('socket.io')(8080);

console.log("Socket listening on port 8080")

io.on('connection', function(socket){
	console.log("!");


})


io.on('chat-message', function(msg){
	io.emit('chat-message',msg);
})