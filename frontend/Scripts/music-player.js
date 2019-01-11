Player = {}

Player.socket;
Player.audio;

Player.play = function(){
	Player.audio.muted = false
	Player.audio.play()
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
	// update image
	document.querySelector(".music-player__artwork").src = metadata.image

	// update metadata
	const element = DomTemplate["song-metadata"](metadata)
	console.log(element)

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

	Visualizer.load(Player.audio, document.getElementById("visualizer"))
}

Player.load_audio = async function(url) {
	const output = new Promise((resolve, reject) => {
		Player.audio.src = Utils.CorsHack(url);
		Player.audio.load();
		Player.audio.oncanplay = resolve
	})

	return output
}

Player.load_metadata = async function(src, type = "LITERAL"){
	if(type === "LITERAL") return src
}

Player.load = async function(streamURL, metadata) {
	if(Player.audio == null) Player.init()

	console.log(metadata)

	Player.render(metadata)
	await Player.load_audio(streamURL)

	

	// if(metadata == "LIVE"){
	// 	metadataLoad = Promise.all([
	// 		window.fetch("/api/metadata")
	// 		.then(res => res.json()),

	// 		window.fetch("/api/color_scheme")
	// 		.then(res => res.json())
	// 	])
	// 	.then(function(data){
	// 		data[0].colorScheme = data[1]
	// 		return data[0]
	// 	})
	// } else {
	// 	metadataLoad = Promise.resolve({
	// 		title: metadata.program_data.name,
	// 		author: metadata.program_data.author,
	// 		image: metadata.program_data.image,
	// 		colorScheme: {
	// 			Primary: [200, 200, 200],
	// 			Secondary: [33, 33, 33]
	// 		}
	// 	})
	// }

	// Promise.all([audioLoad, metadataLoad])
	// .then(function(data){
	// 	return {
	// 		audio: data[0],
	// 		metadata: data[1]
	// 	}
	// })
	// .then(function(data){
	// 	// document.getElementById("Home").classList.remove("hidden");
	// 	// document.getElementById("title").classList.add("hidden");

	// 	Player.render(data.metadata)
	// 	Player.audio.play();
	// })

	// if(metadata == "LIVE"){
	// 	// Player.socket.on("newData", function(data){
	// 		// Player.render(data)
	// 	// })
	// } else {
	// 	// Player.socket.removeAllListeners("newData")
	// }
}

HashLink.on("play", async function(args){

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

		const metadata = { program, episode, image }

		await Player.load(audio_url, metadata)
		Player.play()
	}

	Utils.DomQuery(".page--music-player")[0]
	.scrollIntoView(true)
})

window.addEventListener("load", function(){
	const metadata = {
		track: {
			title: "The Distance",
			artist: "Cake",
			album: "Fashion Nugget",
		},
		episode: {

		},
		program: {
			name: "Plus 90",
			author: "Kermal and Mert"
		}
	}

	Player.load("https://api.teal.cool/download/59e91ca73c94ae000713a88e.mp3", metadata)

})