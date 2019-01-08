const {graphql, buildSchema} = require('graphql')
const fetch = require('node-fetch')

const schema = buildSchema (`
	type Query {
		episode(id: String, shortname: String): Episode,
		program(id: String, shortname: String): Program,
		programs: [Program]
	},
	type Program {
		active: Boolean,
		author: String,
		copyright: String,
		cover_image: String,
		description: String,
		explicit: Boolean,
		image: String,
		itunes_categories: [String],
		language: String,
		name: String,
		organizations: [String],
		owners: [String],
		redirect_url: [String],
		scheduled_time: String,
		shortname: String,
		stream: String,
		subtitle: String,
		tags: String,
		id: String,
		episodes: [Episode]
	},
	type Episode {
		audio_url: String,
		delay: Int,
		description: String,
		end_time: String,
		explicit: Boolean,
		guid: String,
		hits: Int,
		image: String,
		length: Int,
		name: String,
		pubdate: String,
		start_time: String,
		type: String,
		id: String,
		tracks: [Track]
	},
	type Track {
		artist: String,
		log_time: String,
		mbid: String,
		title: String,
		id: String
	}
`)

const root = {
	program: args => (
		fetch("https://api.teal.cool/programs/" + args.id + "")
		.then(res => res.json())
	),
	programs: args => (
		fetch("https://api.teal.cool/organizations/wjrh")
		.then(res => res.json())
	),
	episode: args => (
		fetch("https://api.teal.cool/episodes/" + args.id + "")
		.then(res => res.json())
	)
}

query = `{
	program (id: "sendnudes") {
		name,
		image
	}
}`;

exports.query = function(query){
	return graphql(schema, query, root)
}