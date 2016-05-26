var httph = require('./http-handler.js');


// Start webserver handler
httph.init();

// Start websocket handler

var io = require('socket.io')(80);
var cfg = require('./config.json');
var tw = require('node-tweet-stream')(cfg);
tw.track('socket.io');
tw.track('javascript');
tw.on('tweet', function(tweet){
  io.emit('tweet', tweet);
});


io.on('connection', function(socket){
	console.log("!");


})


io.on('chat-message', function(msg){
	io.emit('chat-message',msg);
})