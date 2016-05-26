





// Handle messages
socket.on('game-logic', function(msg){



	$('#messages').append($('<li>').text(msg));
});

socket.on('chat-message', function(msg){

	$('#messages').append($('<li>').text(msg));
});