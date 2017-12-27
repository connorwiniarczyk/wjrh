// 'use strict'
// We need these modules to make a webserver
const express = require("express");
const app = express();
const http = require('http').Server(app);

// Use this module to communicate with the client via websockets
const io = require("socket.io")(http);

//We need this module to make http requests (To Teal.cool and Last.fm)
const request = require("request");

//We need this module to help work with local files
const path = require('path');

//the module we wrote for handling api requests
const api = require("./api");

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/:method', function(req, res){
	api.call(req.params.method, req.query)
	.then((data) => {
		if(data.type == "file") 		res.sendFile(path.join(__dirname, data.content));
		else if(data.type == "string")	res.send(data.content);
		else if(data.type == "url")		{
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.header('Expires', '-1');
			res.header('Pragma', 'no-cache');
			request(data.content).pipe(res);
		}
		else							res.send("error: type " + data.type + " not recognized");
	})
	.catch((error) => res.send("error: " + error.message));
});

app.use('/', express.static('public'));

// start the server on port 8000
const server = app.listen(8000);
io.listen(server);


// Manage socket connections
io.on('connection', function(socket){
	let data = api.metadata.getData();
	io.emit("newData", data);
	io.emit("UpdateArtwork", data.image);
});

api.metadata.onData(function(data){
	io.emit("newData", data);
	io.emit("UpdateArtwork", data.image);
});