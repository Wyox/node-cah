

io.on('chat-message', function(msg){
	io.emit('chat-message',msg);
})