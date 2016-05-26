var socket = {};
$(document).ready(function(){
	socket = io(location.hostname + ":8080");


	SetPlayerName("Ivo test")

	// Handle messages
	socket.on('game-logic', function(msg){

		$('#messages').append($('<li>').text(msg));
	});

	socket.on('chat-message', function(msg){

		$('#messages').append($('<li>').text(msg));
	});


})




function SetPlayerName(name){
	socket.emit("SetPlayerName",name);
}