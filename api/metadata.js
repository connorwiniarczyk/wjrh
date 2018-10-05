//First, we will use require() to grab our dependencies
const bacon = require("baconjs")	// baconjs is our streaming library,
									// streams provides a datastructure for dealing with a series of
									// asynchronous events, which is incredibly useful in this context 
									// https://baconjs.github.io/index.html
									// 
const fetch = require("node-fetch")	// node-fetch is an implementation of the fetch api in nodejs
									// it is really useful for calling external web APIs
									// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
									// 
const _ = require("lodash")		// lodash is a popular library providing a number of useful functions
									// not included in vanilla javascript. We are using it for its 
									// .equals() and .get() functions
									// https://lodash.com/ 

// For convenience, we will store the URLs of the api's we intend to use as constants

// Teal is WJRH's current DJ management system. Among other things, it provides
// an api for finding out the name of the current show, and the songs they are playing
const tealURL = "https://api.teal.cool/organizations/wjrh/latest"

// If no show is currently playing, WJRH will switch to music from it's robo-dj program
// TODO: <include hyperlink to robo-dj github>
// information about the current song and artist on robo-dj can be found at this URL
const iceCastURL = "http://www.wjrh.org:8000/status-json.xsl"

/**
 * LastFM is a service for looking up detailed Metadata information about a given song.
 * They provide a good API for searching a song by its trackname and artistname,
 * and contain a wealth of information about almost any given song, although we are primarily only
 * using it to find links to Album Artwork
 * 
 * https://www.last.fm/home
 * https://www.last.fm/api/intro
 *
 * Since this API is a little more involved, we will write a function to produce the URL
 * for us, given any trackName and artistName
 * 
 * @param  {string} trackName  The name of the song to look up
 * @param  {string} artistName The name of the song's artist
 * @return {string}            The URL we will use to make our API call
 */
const lastFM_ApiString = function(trackName, artistName){
	const LASTFM_API_KEY = "14cacc2d28210dcd318ffa2085778844"	// out LastFm api key, if a new one is needed for any reason
																// replace it here
	return "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + LASTFM_API_KEY 
	+ "&artist=" + encodeURI(artistName.replace(" ","+"))	// URI encode the artist and trackname
	+ "&track=" + encodeURI(trackName.replace(" ","+"))		// Also, replace spaces with "+"s. 
															// This is a convention defined by LastFm
	+ "&format=json"
}

/**
 * Make a call to Teal and return a promise containing the result
 * @return {Promise} The result of the API call
 */
const tealCall = function(){
	return fetch(tealURL)
		.then(res => res.json())
		.catch(err => err.message)
}

/**
 * Make a call to Icecast and return a promise containing the result
 * @return {Promise} The result of the API call
 */
const iceCastCall = function(){
	return fetch(iceCastURL)
		.then(res => res.json())
		.catch(err => console.log(err.message))
}

/**
 * Make a call to LastFm and return a promise containing the result
 * @return {Promise} The result of the API call
 */
const lastFmCall = function({trackName, artistName}){
	console.log(trackName)
	return fetch(lastFM_ApiString(trackName || "", artistName || ""))	// if either field is null, replace it with an empty string
																		// this prevents crashing
		.then(res => res.json())	// if successful, resolve into the body in json format
		.catch(err => console.log(err.message))	// if there was an error, resolve into the error message
}

//Now, we will start to create our streams. Each one represents a series of asynchronous events


/**
 * 
 * @type {[type]}
 */
const tealStream = bacon.fromPoll(100, tealCall)
.flatMap(bacon.fromPromise)
.map(body => body.event == "episode-end" ? null : body)

const iceCastStream = bacon.fromPoll(100, iceCastCall)
.flatMap(bacon.fromPromise)
.map(data => data.icestats.source[0].title)
.map(title => title.replace(/\[.*\]/, ""))
.map(title => title.split(" - ").map(string => string.trim()))
.map(data => ({
	title: data[0],
	artist: data[1]
}))
.map(track => ({
	track: track
}))

const nowPlaying = bacon.when(
	[tealStream, iceCastStream], (teal, iceCast) => teal || iceCast
).skipDuplicates(_.isEqual)
.log()

lastFmEvents = nowPlaying
.map(teal => lastFmCall(teal.track || {}))
.flatMap(bacon.fromPromise)
.log()

const metadata = bacon.when(
	[nowPlaying, lastFmEvents], function(teal, lastFm){
		let data = {teal: teal, lastFm: lastFm}

		return {
			songname: chooseFrom(data)([
				"lastFm.track.name",
				"teal.track.title"
			], null),
			artistname: chooseFrom(data)([
				"lastFm.track.artist.name",
				"teal.track.artist"
			], null),
			title: chooseFrom(data)([
				"teal.program.name"
			], null),
			album: chooseFrom(data)([
				"lastFm.track.album.title"
			], null),
			author: chooseFrom(data)([
				"teal.program.author"
			], "RoboDJ"),
			image: chooseFrom(data)([
				"lastFm.track.album.image[3].#text",
				"teal.episode.image",
				"teal.program.image"
			 ], "https://media.giphy.com/media/kIjnPxW8ESIqQ/giphy.gif")
		}
	}
).log()

let dataCache = {}
metadata.onValue(data => dataCache = data)

exports.getData = function(key) {
	if(key == null) return dataCache
	else return dataCache[key]
}

exports.stream = metadata

exports.onData = func => metadata.onValue(func)

const chooseFrom = obj => (paths, Default) => {
	return paths.reduce((prev, cur) => {
		return prev || _.get(obj, cur)
	}, _.get(obj, paths[0])) || Default
}