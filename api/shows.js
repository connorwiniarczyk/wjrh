const fetch = require("node-fetch")

exports.getPrograms = function() {
	return fetch("https://api.teal.cool/organizations/wjrh")
	.then(res => res.json())
}

exports.getEpisodes = function(programName, episodeName){
	return fetch("https://api.teal.cool/programs/" + programName + "")
	.then(res => res.json())
	.then(body => body.episodes)
}

exports.getInfo = function(programName, episode_id) {
	lookups = []
	lookups.push(
		fetch("https://api.teal.cool/programs/" + programName + "")
		.then(res => res.json())
	)

	if(!(episode_id === undefined)) {
		lookups.push(
			fetch("https://api.teal.cool/episodses" + episode_id + "")
			.then(res => res.json())
		)
	}

	return Promise.all(lookups)
	.then(result => ({
		program: result[0],
		episode: result[1]
	}))
}