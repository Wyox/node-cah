
var http 	= require('http');
var fs 		= require('fs');
var path 	= require('path');
var server;
var port = 8000;

var mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};



exports.init = function(){
	server = http.createServer(handleRequest);


	//Lets start our server
	server.listen(port, function(){
		console.log("Server listening on: http://localhost:%s", port);
	});

}


// Start socket.io handler

function handleRequest(request, response){

	// Security with ../ stuff
	var myCurrentURL = request.url.replace("../","");
	var fileUrl = myCurrentURL;

	// Remove any unneeded double slashes
	if(fileUrl.length > 1){
		if(fileUrl.charAt(0) == "/" && fileUrl.length > 2){
			fileUrl = fileUrl.slice(1,fileUrl.lenght);

			if(fileUrl.charAt(0) == "/"){
				fileUrl = "";
			}
		}		
	}

	// If a path is given go there, otherwise just stick to index.html if it's being called
	if(fileUrl.length > 0 && fileUrl != "/"){
		fileUrl = "public_html/" + fileUrl;
	}else{
		fileUrl = "public_html/index.html";
	}


	// Serve the static file if it exists otherwise normal processing
	if(fs.existsSync(fileUrl) == true && fs.statSync(fileUrl).isFile() ){
		var mimeType = mimeTypes[path.extname(fileUrl).split(".")[1]];
		response.writeHead(200, 'OK', {'Content-Type': mimeType});

		// Stream request to the browser
		var fileStream = fs.createReadStream(fileUrl);
		fileStream.pipe(response);
		
	}else{
		// Programatically handle the request
		DefaultHandler(request,response);
	}

    
}


function DefaultHandler(request,response){
	response.end("HELLO WORLD");
}
