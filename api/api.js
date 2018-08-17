const request = require("request");
const metadata = require("./metadata");
const colors = require("./colors");
const shows = require("./shows");

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
	})
}

const scripts = {
	"vibrant": 		"public/Scripts/Dependencies/vibrant.js",
	"handlebars": 	"public/Scripts/Dependencies/handlebars.js",
	"socket.io": 	"public/Scripts/Dependencies/socket.io.js",
	"visualizer": 	"public/Scripts/visualizer.js"
}