var colors = require('colors');
var networktools = require('./network-tools.js');
var webserverport = 8000;
var websocketport = 8080;
console.log("============================================".rainbow)
console.log("Cards against humanity Multiplayer Server")
console.log("")
console.log("")
console.log("Made by Judith Kaptein, Russell Zweers and")
console.log("Ivo de Bruijn (ICTDT2SE)")
console.log("============================================".rainbow)

console.log("Webserver listening to the following addresses:")

// Get all network interfaces
var NetworkIPs = networktools.getInterfaces();

// Show all possible connections
for (var i = NetworkIPs.length - 1; i >= 0; i--) {
	var addr = "http://" + NetworkIPs[i] + ":" + webserverport;
	console.log(addr.green);
}

console.log("==========================================".rainbow)
console.log("")
console.log("")
var httph = require('./http-handler.js');


// Start webserver handler
httph.init(webserverport);

// Start websocket handler
var io = require('socket.io')(websocketport);


var gamelogic = require('./gamelogic.js');
var chat = require('./chat.js');


gamelogic.init(io);
chat.init(io);


