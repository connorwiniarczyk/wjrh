Player = {}
Player.audio

window.addEventListener("load", () => Player.audio = document.getElementById("music-player"))

// Control Signals
Player.stop = function(){
	Player.audio.removeAttribute("src")
	Player.audio.load()

	document.querySelector(".music-controls")
		.setAttribute("data-state", "off")
}

Player.start = async function(url){
	const default_url = Player.audio.getAttribute("data-default-url")
	await Player.load_audio(url || default_url)
	Player.audio.play()

	document.querySelector(".music-controls")
		.setAttribute("data-state", "stream")
}

Player.toggle_stopped = function(){
	if(Player.audio.src){
		Player.stop()
	} else {
		Player.start()
	}
}

Player.pause = function(){}
Player.play = function(){}

// Player.update_appearance = function(){
// 	// play-pause button
// 	if(!Player.audio.src){
// 		Player.playpause_live.classList.remove("pause")
// 		Player.playpause_live.classList.add("play")
// 	} else {
// 		Player.playpause_live.classList.remove("play")
// 		Player.playpause_live.classList.add("pause")
// 	}
// }

Player.load_audio = function(url) {
	return new Promise((resolve, reject) => {
		Player.audio.src = `${url}?date=${Date.now()}`
		Player.audio.load();
		Player.audio.oncanplay = resolve
	})
}

// Player.load_metadata = async function({ literal, url }){
// 	if(literal) {
// 		return literal
// 	} else if(url) {
// 		const request = fetch(url).then(res => res.json())
// 		const { image, ...track } = await request

// 		return { image, track }
// 	} 
// }

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

		await Player.load_audio(audio_url)
		document.getElementById("media-player").play()
	}

	Utils.DomQuery(".page--music-player")[0]
	.scrollIntoView(true)
})

// HashLink.on("listen-live", async function(args){
// 	const url = args.url || Player.audio.getAttribute("data-default-url")
// 	await Player.load_audio(url)
// 	console.log(Player.audio)
// 	Player.audio.play()
// 	Player.audio.muted = false;
// })
