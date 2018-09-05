const Vibrant = require("node-vibrant")
const Metadata = require("./metadata.js")
const Bacon = require("baconjs")
const _ = require("lodash")

exports.stream = Metadata.stream
.map(data => Vibrant.from(data.image).getPalette())
.flatMap(Bacon.fromPromise)
.map(data => ({
	LightVibrant:	_.get(data, "LightVibrant._rgb"),
	Vibrant: 		_.get(data, "Vibrant._rgb"),
	DarkVibrant: 	_.get(data, "DarkVibrant._rgb"),
	LightMuted: 	_.get(data, "LightMuted._rgb"),
	Muted: 			_.get(data, "Muted._rgb"),
	DarkMuted: 		_.get(data, "DarkMuted._rgb")
}))
.map(colors => ({
	Primary: chooseFrom(colors)([
		"LightVibrant",
		"Vibrant",
		"LightMuted"
	], [230, 230, 230]),
	Secondary: chooseFrom(colors)([
		"DarkMuted",
		"Muted",
		"DarkVibrant"
	], [0, 50, 50])
}))

exports.colorScheme = {}
exports.stream.onValue(function(data){
	console.log(data);
	exports.colorScheme = data
})

const chooseFrom = obj => (paths, Default) => {
	return paths.reduce((prev, cur) => {
		return prev || _.get(obj, cur)
	}, _.get(obj, paths[0])) || Default
}