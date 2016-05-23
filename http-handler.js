
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

	var myCurrentURL = request.url.replace("../","");
	var fileUrl = myCurrentURL;

	if(fileUrl.length > 1){
		if(fileUrl.charAt(0) == "/" && fileUrl.length > 2){
			fileUrl = fileUrl.slice(1,fileUrl.lenght);

			if(fileUrl.charAt(0) == "/"){
				fileUrl = "";
			}
		}		
	}

	if(fileUrl.length > 0){
		fileUrl = "public_html/" + fileUrl;
	}else{
		fileUrl = "public_html/index.html";
	}



	// Serve the static file if it exists otherwise normal processing
	if(fs.existsSync(fileUrl) == true && fs.statSync(fileUrl).isFile() ){
		var mimeType = mimeTypes[path.extname(fileUrl).split(".")[1]];
		response.writeHead(200, mimeType);

		var fileStream = fs.createReadStream(fileUrl);
		fileStream.pipe(response);


	}else{
		DefaultHandler(request,response);
	}

    
}


function DefaultHandler(request,response){
	response.end("HELLO WORLD");
}