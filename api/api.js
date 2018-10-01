const request = require("request");
const metadata = require("./metadata");
const colors = require("./colors");
const shows = require("./shows");

exports.call = function(method, params){
	return (apiMethods[method])(params);
};

exports.metadata = metadata;
exports.colors = colors;

const apiMethods = {
	"getScript": params => Promise.resolve({
		type: "file", 
		content: scripts[params.script]
	}),
	"metadata": params => Promise.resolve({
		type: "string", 
		content: metadata.getData(params.item) 
	}),
	"artwork": params => Promise.resolve({
		type: "url", 
		content: metadata.getData("image")
	}),
	"color_scheme": params => Promise.resolve({
		type: "string",
		content: colors.colorScheme
	}),
	"programs": params => shows.getPrograms()
	.then(function(programs){
		return {
			type: "string", 
			content: programs
		}
	}),
	"episodes": params => shows.getEpisodes(params.program)
	.then(function(episodes){
		return {
			type: "string",
			content: episodes
		}
	}),
	"listen": params => Promise.resolve({
		type: "url",
		content: "http://api.teal.cool/download/" + params.id + ".mp3"
	}),
	"info": params => shows.getInfo(params.program, params.episode)
	.then(info => ({
		type: "string",
		content: info
	}))
}

const scripts = {
	"vibrant": 		"public/Scripts/Dependencies/vibrant.js",
	"handlebars": 	"public/Scripts/Dependencies/handlebars.js",
	"socket.io": 	"public/Scripts/Dependencies/socket.io.js",
	"visualizer": 	"public/Scripts/visualizer.js"
}