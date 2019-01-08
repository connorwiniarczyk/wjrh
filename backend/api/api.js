const request = require("request");
const metadata = require("song-metadata");

exports.call = function(method, params){
	return (apiMethods[method])(params);
};

exports.metadata = metadata;

const apiMethods = {
	"getScript": params => Promise.resolve({
		type: "file", 
		content: scripts[params.script]
	}),
	"metadata": params => Promise.resolve({
		type: "string", 
		content: {} 
	}),
	"artwork": params => Promise.resolve({
		type: "url", 
		content: metadata.getData("image")
	}),
	"listen": params => Promise.resolve({
		type: "url",
		content: "http://api.teal.cool/download/" + params.id + ".mp3"
	}),
}

const scripts = {
	"vibrant": 		"public/Scripts/Dependencies/vibrant.js",
	"handlebars": 	"public/Scripts/Dependencies/handlebars.js",
	"socket.io": 	"public/Scripts/Dependencies/socket.io.js",
	"visualizer": 	"public/Scripts/visualizer.js"
}