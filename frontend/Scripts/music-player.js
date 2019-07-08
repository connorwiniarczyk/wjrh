Player = {}

Player.control_sets = {}
Player.playpause_live = {}
Player.playpause_recorded = {}

window.addEventListener("load", function(){
	Player.control_sets = new TabMenu(Utils.DomQuery(`
		.controls .btn--listen-live,
		.controls .controls__live
	`))

	Player.playpause_live = document.getElementById('play-pause--live')

	Player.control_sets.switchTo(0)
})


Player.live_src = 'http://www.wjrh.org:8000/WJRH'

Player.audio
Player.isLive = true
Player.Controls = {}

Player.play_pause //Utils.DomQuery(".music-player__controls .btn--play-pause")[0]

Player.mute = function(){
	Player.audio.muted = true
	Player.update_appearance()
}

Player.unmute = function(){
	Player.audio.muted = false
	Player.update_appearance()
}

Player.toggle_muted = function(){
	Player.audio.muted = !Player.audio.muted
	Player.update_appearance()
}

Player.pause = function(){}
Player.play = function(){}

Player.isPaused = function(){
	if(Player.isLive) {
		return Player.audio.muted
	} else {
		return Player.audio.paused()
	}
}

Player.update_appearance = function(){
	// play-pause button
	if(Player.audio.muted){
		Player.playpause_live.classList.remove("pause")
		Player.playpause_live.classList.add("play")
	} else {
		Player.playpause_live.classList.remove("play")
		Player.playpause_live.classList.add("pause")
	}
}

window.addEventListener("load", function(){
	Player.play_pause = Utils.DomQuery(".music-player__controls .btn--play-pause")[0]
	Player.play_pause.onclick = function(){
		if(Player.audio.muted)	Player.Controls.play()
		else 					Player.Controls.pause()
	}

	// TODO: volume, mute-unmute
})

Player.Controls.load = function(live){

	if(live) {
		Player.mute = function(){
			Player.audio.muted = true

			// switch play-pause buttons to pause
			Utils.DomQuery(".music-player__controls .btn--play-pause")
			.forEach(btn => {
				btn.classList.remove("play")
				btn.classList.add("pause")
			})
		}

		Player.unmute = function(){
			Player.audio.muted = false

			// switch play-pause buttons to pause
			Utils.DomQuery(".music-player__controls .btn--play-pause")
			.forEach(btn => {
				btn.classList.remove("pause")
				btn.classList.add("play")
			})
		}

		// When playing live music, pausing should behave like muting
		Player.pause = Player.mute
		Player.play = Player.unmute
	}
}

Player.Controls.play = function(){
	Player.audio.muted = false
	Player.audio.play()

	// switch play-pause buttons to pause
	Utils.DomQuery(".music-player__controls .btn--play-pause")
	.forEach(btn => {
		btn.classList.remove("play")
		btn.classList.add("pause")
	})
}

Player.toggle = function(){
	if(Player.audio == null) return

	if(Player.audio.muted){ 
		Player.audio.muted = false
		// document.getElementById("play-pause-btn").classList.remove("play")
		// document.getElementById("play-pause-btn").classList.add("pause")
	} else {
		Player.audio.muted = true
		// document.getElementById("play-pause-btn").classList.remove("pause")
		// document.getElementById("play-pause-btn").classList.add("play")
	}
}

Player.render = function(metadata){
	if(!metadata) return

	// update image
	document.querySelector(".music-player__artwork").src = metadata.image

	// update metadata
	const element = DomTemplate["song-metadata"](metadata)
	const appendTarget = document.querySelector(".music-player__details")
	appendTarget.innerHTML = ""
	appendTarget.appendChild(element)
}

Player.init = function(){
	// document.getElementById("loading-animation").classList.remove("hidden")
	// document.getElementById("listen-live-btn").classList.add("hidden")

	Player.audio = document.createElement('audio')
	Player.audio.crossOrigin = 'anonymous'

	console.log(Player.audio)

	Visualizer.init({
		audio: Player.audio, 
		parent: document.getElementById("visualizer"),
	})

	Visualizer.begin()
}

Player.load_audio = async function(url) {
	const output = new Promise((resolve, reject) => {
		Player.audio.src = Utils.CorsHack(url);
		Player.audio.load();
		Player.audio.oncanplay = resolve
	})

	return output
}

Player.load_metadata = async function({ literal, url }){
	if(literal) {
		return literal
	} else if(url) {
		const request = fetch(url).then(res => res.json())
		const { image, ...track } = await request

		return { image, track }
	} 
}

Player.load = async function(streamURL, options = {}) {
	if(Player.audio == null) Player.init()

	if(options.metadata) {
		// Player.render(await Player.load_metadata(options.metadata))
	}

	if(options.live){
		Player.control_sets.switchTo(1)
	} else {
		Player.control_sets.switchTo(0)
	}
	
	await Player.load_audio(streamURL)

	for(const key in Player.Controls_Live) {
		let output = Player.Controls_Live[key]
		Player.Controls[key] = Player.updates_controls.applyTo(output)
	}


	console.log(Player.Controls)
	Player.Controls.play()

	// if(metadata == "LIVE"){
	// 	// Player.socket.on("newData", function(data){
	// 		// Player.render(data)
	// 	// })
	// } else {
	// 	// Player.socket.removeAllListeners("newData")
	// }
}

HashLink.on("listen", async function(args){
	if(args.episode && args.program) {
		const query = `{
			program(shortname: "${args.program}"){
				name,
				author,
				image
			},
			episode(id: "${args.episode}"){
				audio_url,
				description
			}
		}`

		const res = await Utils.tealQuery(query)

		const { image, ...program } = res.program
		const { audio_url, ...episode } = res.episode

		const metadata = { program, episode, image, volatile: false }

		await Player.load(audio_url, { metadata })
		Player.audio.play()
	}

	Utils.DomQuery(".page--music-player")[0]
	.scrollIntoView(true)
})

HashLink.on("listen-live", async function(args){
	const default_url = Player.live_src

	if(args.url === undefined) args.url = default_url

	const metadata = {
		url:'http://45.55.38.183:4001/now-playing'
	}

	await Player.load(args.url, { 
		live: true, 
		metadata,
	})

	Player.audio.play()
	Player.audio.muted = false;
})