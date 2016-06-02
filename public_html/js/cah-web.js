var socket = {};
var GameInfo;
var PlayerIsReady = false
var localState;
var selectCount = 0

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
				$(".cah-game").html('').append($(".waiting-for-players-template").clone());
				Binder();
				console.log("restart");
			break;
			case "start-game":

				// Start game
				$(".cah-game").html('').append($(".game-field-template").clone());
				Binder();
				console.log("Start game");
			break;
			case "player-pick":
				selectCount = 0;
				$(".cah-game").html('').append($(".game-field-template").clone());



				// Toon zwarte kaart
				var myBlackCard = $(".templates .black-card-template").clone().removeClass("black-card-template");

				myBlackCard.find(".card-text").html(GameInf.blackcard.text).removeClass("black-card-template");


				// Toon alle kaarten
				var mySelf = GetMe();

				$(".cah-game .play-area .black-card-spot").append(myBlackCard);


				for (i in mySelf.cards) {
					var card = mySelf.cards[i];
					var myWhiteCard = $(".templates .white-card-template").clone();
					myWhiteCard.removeClass("white-card-template");
					myWhiteCard.find(".card-text").html(card.text);
					myWhiteCard.find(".white-card").attr("data-card-id", card.id);

					$(".cah-game .player-cards").append(myWhiteCard);
				}

				Binder();
			break;	
			case "czar-pick":
				$('.cah-game .player-selected-cards').html('');
				$('.cah-game .other-player-selected-cards').html('');
				for (i in GameInf.players) {
					
					var mySet = $(".templates .player-card-set-template").clone();
					mySet.removeClass('player-card-set-template')
					mySet.attr("data-player-id", GameInf.players);
					var ply = GameInf.players[i];

					if(ply.you === false){
						for(k in ply.selectedCards){
							var myWhiteCard = $(".templates .white-card-template").clone();
							myWhiteCard.find(".card-text").html(ply.selectedCards[k].text);
							mySet.append(myWhiteCard);
						}	
						console.log(mySet);

						$('.cah-game .other-player-selected-cards').append(mySet);		
					}else{
						for(k in ply.selectedCards){
							var myWhiteCard = $(".templates .white-card-template").clone();
							myWhiteCard.find(".card-text").html(ply.selectedCards[k].text);
							mySet.append(myWhiteCard);
						}
						$('.cah-game .player-selected-cards').append(mySet);
					}

				}
				Binder()

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
		case "player-pick":
			$(".cah-status").html("Players picking cards");

			// Check if other players already placed cards, if so. Show them as EMPTY cards on the screen
			$('.cah-game .other-player-selected-cards').html('');

			for (i in GameInf.players) {
				var ply = GameInf.players[i];
				if(ply.you === false){
					for(k in ply.selectedCards){
						var myWhiteCard = $(".templates .white-card-template").clone();
						$('.cah-game .other-player-selected-cards').append(myWhiteCard);
					}					
				}

			}


			if(GetMe().type == "card-czar"){
				// Card-czar cannot pick a card, there for his cards are disabled for a bit.
				$(".cah-game .player-cards").addClass("disabled");
			}else{
				// Select card
				$(".cah-game .player-cards").addClass("active");
			}
		break;
		case "czar-pick":
			$(".cah-status").html("Czar picking cards");
			if(GetMe().type == "card-czar"){
				$(".czar-button").removeClass("hidden").attr("disabled",false);
			}
			
		break;
	}

	// Handle some stuff that only happens everytime the game info gets updated.

	// Do different stuff on each event in GameInfo

	localState = GameInfo.state;


}

function GetMe(){
	var rc;
	for (i in GameInfo.players) {
		var ply = GameInfo.players[i];
		if(ply.you === true){
			rc = ply;
			break;
		}
	}

	return rc;
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

		var nickname = $('.cah-game input[name="nickname"]').val();

		if(nickname.length < 3){
			$(".nickname-error").html("Pick a longer nickname");
		}else{
			SetPlayerName(nickname);
			localStorage.setItem('nickname',nickname);
		}
	});

	$('.player-cards .white-card').on('click',function(){
		if(selectCount <  GameInfo.blackcard.numanswers){
			// If it's the card-czar, just ignore it
			if(GetMe().type != "card-czar"){
				$(".white-card").removeClass("selected");
				$(this).addClass("selected");
				$(".select-card input").attr("disabled",false);

			}
		}
	});

	$(".select-card input[type='button']").on('click',function(){
		if($(".player-cards .white-card.selected").length > 0){
			selectCount = selectCount + 1;

			// We answered everything. block it

			if(selectCount >=  GameInfo.blackcard.numanswers){
				// We have enough answers, disable Select button
				$(this).attr("disabled","disabled");
			}

			// Card selected, make it definite
			socket.emit("SetCard",$(".white-card.selected").attr("data-card-id"));

			// Remove it from the stack visually
			var item = $(".white-card.selected").removeClass("selected");
			item = item.parent();
			$(".cah-game .play-area .player-selected-cards").append(item);

		}
	});

	$('.player-card-set .white-card').on('click',function(){
		// Check if you are a czar and in the czar phase
		console.log("YES?");
		if(GameInfo.state == "czar-pick" && GetMe().type == "card-czar"){
			$(".player-card-set").removeClass("selected");
			$(".player-card-set .white-card").removeClass("selected");
			
			$(this).closest('.player-card-set').addClass("selected");
			$(this).closest('.player-card-set').find(".white-card").addClass("selected");
		}
	})

	$(".button-ready").on("click",function(){
		SetReadyState(!PlayerIsReady);
		PlayerIsReady = !PlayerIsReady;
	})
}