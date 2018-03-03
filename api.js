const request = require("request");
const metadata = require("./metadata");

exports.call = function(method, params){
	return (apiMethods[method])(params);
};

exports.metadata = metadata;

const apiMethods = {
	"getScript": function(params){
		return new Promise((resolve, reject) => {
			if(scripts[params.script] == null)	reject(new Error("method not found"));
			else								resolve({type: "file", content: scripts[params.script]});
		});
	},
	"metadata": function(params){
		return new Promise((resolve, reject) => {
			resolve({ type: "string", content: metadata.getData(params.item) });
		});
	},
	"artwork": function(params){
		return new Promise((resolve, reject) => {
			resolve({type: "url", content: metadata.getData("image")})
		});
	}
};

const scripts = {
	"vibrant": "public/Scripts/Dependencies/vibrant.js",
	"handlebars": "public/Scripts/Dependencies/handlebars.js",
	"socket.io": "public/Scripts/Dependencies/socket.io.js",
	"visualizer": "public/Scripts/visualizer.js"
};