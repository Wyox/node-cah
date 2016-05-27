var socket = {};
var GameInfo = {};


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

	socket.on('GameInfoUpdate',function(GameInf){
		HandleGameInfoUpdate(GameInf);
		console.log(GameInf);
	})


})



function HandleGameInfoUpdate(GameInf){
	GameInfo = GameInf;

	// Handle some stuff that only happens everytime the game info gets updated.

	
}




function SetPlayerName(name){
	socket.emit("SetPlayerName",name);
}