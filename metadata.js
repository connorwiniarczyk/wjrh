const bacon = require("baconjs")
const request = require("request")
const events = require("events")
const _ = require("lodash") // Utility Functions
const eventEmitter = new events.EventEmitter()

const tealURL = "https://api.teal.cool/organizations/wjrh/latest"

const lastFM_ApiString = function(trackName, artistName){
	const LASTFM_API_KEY = "14cacc2d28210dcd318ffa2085778844"
	return "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + LASTFM_API_KEY 
	+ "&artist=" + encodeURI(artistName.replace(" ","+"))
	+ "&track=" + encodeURI(trackName.replace(" ","+"))
	+ "&format=json"
}

const tealCall = function() {
	return new Promise((resolve, reject) => {
			request(tealURL, {json: true}, function(err, res, body){
			resolve(body)
		})
	})
}

const lastFmCall = function(trackName, artistname){
	return new Promise((resolve, reject) => {
		request(lastFM_ApiString(trackName, artistname), {json: true}, function(err, res, body){
			if(err) reject(err)
			else resolve(body)
		})
	})
}

setInterval(() => {
	tealCall()
	.then(body => eventEmitter.emit("tealResponse", body))
	.catch(error => eventEmitter.emit("tealError", error))
}, 100)

let tealEvents = bacon.fromEvent(eventEmitter, "tealResponse").skipDuplicates(_.isEqual)

tealEvents.onValue(newData => {
	lastFmCall(newData.track.title, newData.track.artist)
	.then(body => eventEmitter.emit("lastFmResponse", body))
	.catch(error => eventEmitter.emit("lastFmResponse", error))
})

let lastFmEvents = bacon.fromEvent(eventEmitter, "lastFmResponse")

let metadata = tealEvents.zip(lastFmEvents, function(teal, lastFm){

	const defaultImage = "http://45.55.38.183/resources/Art/default.jpg"
	let data = {teal: teal, lastFm: lastFm}

	return {
		songname: priority([
			"lastFm.track.name",
			"teal.track.title"
		], "")(data),
		artistname: priority([
			"lastFm.track.artist.name",
			"teal.track.artist"
		], "")(data),
		title: priority([
			"teal.program.name"
		], "RoboDJ's greatest hits")(data),
		author: priority([
			"teal.program.author"
		], "RoboDJ")(data),
		image: priority([
			"lastFm.track.album.image[3].#text",
			"teal.episode.image",
			"teal.program.image"
		], defaultImage)(data)
	}
})

//TODO: delete
const pickBestImage = function(teal, lastFm){

	const defaultImage = "http://45.55.38.183/resources/Art/default.jpg"

	if(lastFm instanceof Error) {
		if(teal.episode.image != null) return teal.episode.image
		else if(teal.program.image != null) return teal.program.image
		else return defaultImage
	} else {
		if(lastFm.track == null) return defaultImage
		else if(lastFm.track.album == null) return defaultImage
		else if(lastFm.track.album.image == null) return defaultImage
		else return lastFm.track.album.image[3]['#text']
	}
}

metadata.log()

let dataCache = {}
metadata.onValue(data => dataCache = data)

exports.getData = function(key) {
	if(key == null) return dataCache
	else return dataCache[key]
}

exports.onData = func => metadata.onValue(func)

const priority = (paths, Default) => obj => {
	return paths.reduce((prev, cur) => {
		return prev || _.get(obj, cur)
	}, _.get(obj, paths[0])) || Default
}
console.log(exports.getData())