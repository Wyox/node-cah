var httph = require('./http-handler.js');


// Start webserver handler
httph.init();

// Start websocket handler
var io = require('socket.io')(8080);


var gamelogic = require('./gamelogic.js');
var chat = require('./chat.js');


gamelogic.init(io);
chat.init(io);


