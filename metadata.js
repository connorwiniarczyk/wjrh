const bacon = require("baconjs")
const request = require("request")
const events = require("events")
const fetch = require("node-fetch")
const _ = require("lodash") // Utility Functions
const eventEmitter = new events.EventEmitter()

const tealURL = "https://api.teal.cool/organizations/wjrh/latest"
const iceCastURL = "http://www.wjrh.org:8000/status-json.xsl"

const lastFM_ApiString = function(trackName, artistName){
	const LASTFM_API_KEY = "14cacc2d28210dcd318ffa2085778844"
	return "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + LASTFM_API_KEY 
	+ "&artist=" + encodeURI(artistName.replace(" ","+"))
	+ "&track=" + encodeURI(trackName.replace(" ","+"))
	+ "&format=json"
}

const tealCall = function(){
	fetch(tealURL)
	.then(res => res.json())
	.then(body => body.event == "episode-end" ? null : body)
	.then(data => eventEmitter.emit("tealResponse", data))
	.catch(err => eventEmitter.emit("tealResponse", err))
}

const iceCastCall = function(){
	fetch(iceCastURL)
	.then(res => res.json())
	.then(data => data.icestats.source[0].title.split(" - "))
	.then(data => data.map(element => element.replace(/\[.*?\]/, "")))
	.then(data => {
		return {
			track: {
				title: data[1],
				artist: data[0]
			}
		}
	})
	.then(data => eventEmitter.emit("iceCastResponse", data))
	.catch(err => eventEmitter.emit("iceCastResponse", err))
}

const lastFmCall = function(trackName, artistName){
	fetch(lastFM_ApiString(trackName || "", artistName || "")) // 
	.then(res => res.json())
	.then(body => eventEmitter.emit("lastFmResponse", body))
}

setInterval(tealCall, 100)
setInterval(iceCastCall, 100)

const tealEvents = bacon.fromEvent(eventEmitter, "tealResponse")
const iceCastEvents = bacon.fromEvent(eventEmitter, "iceCastResponse")
const lastFmEvents = bacon.fromEvent(eventEmitter, "lastFmResponse")

const nowPlaying = tealEvents.zip(iceCastEvents, function(teal, iceCast){
	return teal || iceCast
}).skipDuplicates(_.isEqual)

nowPlaying.onValue(newData => {
	lastFmCall(_.get(newData,"track.title"), _.get(newData,"track.artist"))
})

const metadata = nowPlaying.zip(lastFmEvents, function(teal, lastFm){
	let data = {teal: teal, lastFm: lastFm}

	return {
		songname: chooseFrom([
			"lastFm.track.name",
			"teal.track.title"
		], "Song Unknown")(data),
		artistname: chooseFrom([
			"lastFm.track.artist.name",
			"teal.track.artist"
		], "Artist Unknown")(data),
		title: chooseFrom([
			"teal.program.name"
		], "RoboDJ's greatest hits")(data),
		author: chooseFrom([
			"teal.program.author"
		], "RoboDJ")(data),
		image: chooseFrom([
			"lastFm.track.album.image[3].#text",
			"teal.episode.image",
			"teal.program.image"
		 ], "https://media.giphy.com/media/kIjnPxW8ESIqQ/giphy.gif"
		)(data)
	}
})

metadata.log()

let dataCache = {}
metadata.onValue(data => dataCache = data)

exports.getData = function(key) {
	if(key == null) return dataCache
	else return dataCache[key]
}

exports.onData = func => metadata.onValue(func)

const chooseFrom = (paths, Default) => obj => {
	return paths.reduce((prev, cur) => {
		return prev || _.get(obj, cur)
	}, _.get(obj, paths[0])) || Default
}