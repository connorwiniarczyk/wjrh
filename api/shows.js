const fetch = require("node-fetch")

exports.getPrograms = function() {
	return fetch("https://api.teal.cool/organizations/wjrh")
	.then(res => res.json())
	// .then(body => body.map(elem => elem.name))
}

exports.getEpisodes = function(programName){
	return fetch("https://api.teal.cool/programs/" + programName + "")
	.then(res => res.json())
	.then(body => body.episodes)
}

exports.getPrograms()