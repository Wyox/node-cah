var socket = {};
var GameInfo;
var PlayerIsReady = false
var localState;

$(document).ready(function(){
	socket = io(location.hostname + ":8080");

	socket.on('connect',function(){
		// Set our name
	});

	socket.on('reconnect',function(arg){
		if(localStorage.getItem('nickname') != null){
			// Set this to our current player name
			SetPlayerName(localStorage.getItem('nickname'));
		}
	});

	// Handle messages
	socket.on('game-logic', function(msg){

		$('#messages').append($('<li>').text(msg));
	});

	socket.on('chat-message', function(msg){

		$('#messages').append($('<li>').text(msg));
	});

	// GameInfo Update
	socket.on('GameInfoUpdate',function(GameInf){
		HandleGameInfoUpdate(GameInf);
	})

	if(localStorage.getItem('nickname') != null){
		// Set this to our current player name
		SetPlayerName(localStorage.getItem('nickname'));
		$('input[name="nickname"]').val(localStorage.getItem('nickname'));
	}

})



function HandleGameInfoUpdate(GameInf){
	var ready = 0;
	GameInfo = GameInf;


	// Initial call to a new state
	if(localState != GameInfo.state){
		switch(GameInfo.state){
			case "waiting-for-players":
				// Load waiting for players screen
				$(".cah-game").html('').append($(".waiting-for-players-template"));
				Binder();
			break;
			case "start-game":

				// Start game
				$(".cah-game").html('').append($(".game-field-template"));
				Binder();
				console.log("Start game");
			break;		
		}	
	}	

	// Update player count if we can.

	$('.players-amount').html(GameInf.players.length);
	if(localStorage.getItem('nickname') != null){
		$('.cah-username').html(localStorage.getItem('nickname'));
	}

	
	// Count ready players
	for (i in GameInf.players) {
		var ply = GameInf.players[i];
		if(ply.ready === true){
			ready = ready + 1;
		}
	}

	$(".players-ready").html(ready);

	switch(GameInfo.state){
		case "start-game":
			$(".cah-status").html("Preparing round...");
		break;
	}

	// Handle some stuff that only happens everytime the game info gets updated.

	// Do different stuff on each event in GameInfo

	localState = GameInfo.state;


}

function GetMe(){
	var rc;
	console.log(GameInfo);
	for (i in GameInfo.players) {
		var ply = GameInfo.players[i];
		if(ply.you === true){
			rc = ply;
			break;
		}
	}

	return;
}



function SetPlayerName(name){
	socket.emit("SetPlayerName",name);
	$(".button-ready").prop("disabled",false);
}

function SetReadyState(state){
	if(state == true){
		$(".ready-negate").html("");
	}else{
		$(".ready-negate").html("not");
	}
	socket.emit("SetReadyState",state);
}

function GetReadyState(){

}


function GetPlayerCount(){
	// Check if we are connected
	if(isConnected() == true){
		return GameInfo.players.length
	}else{
		return 0;
	}
}


function isConnected(){

	if(GameInfo != null){
		return true
	}

	return false;

}

// This function allows us to rebind anything again if new HTML has been shown.
function Binder(){
	$('.button-save-nickname').on('click',function(){
		$(".nickname-error").html("");

		var nickname = $('input[name="nickname"]').val();

		if(nickname.length < 4){
			$(".nickname-error").html("Pick a longer nickname");
		}else{
			SetPlayerName(nickname);
			localStorage.setItem('nickname',nickname);
		}
	})

	$(".button-ready").on("click",function(){
		SetReadyState(!PlayerIsReady);
		PlayerIsReady = !PlayerIsReady;
	})
}