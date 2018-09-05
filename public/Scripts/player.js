const Player = {}

Player.socket;
Player.audio;

Player.play = function(){

}

Player.pause = function(){

}

Player.toggle = function(){
	if(Player.audio == null) return

	if(Player.audio.muted){ 
		Player.audio.muted = false
		document.getElementById("play-pause-btn").classList.remove("play")
		document.getElementById("play-pause-btn").classList.add("pause")
	} else {
		Player.audio.muted = true
		document.getElementById("play-pause-btn").classList.remove("pause")
		document.getElementById("play-pause-btn").classList.add("play")
	}
}

window.addEventListener("load", function(){
	document.getElementById("play-pause-btn").onclick = Player.toggle
})

Player.setColorScheme = function(scheme) {
	document.getElementById("Home").style.background = toStyle(scheme.Secondary)
	Visualizer.setColor(scheme.Primary)
}

Player.render = function(metadata) {
	// Player.audio = data.audio

	// update image
	document.querySelector(".album-art > .content")
	.style.background = "url(/api/artwork?time=" + (new Date()).getTime() + ")";

	// update metadata
	display = document.getElementById("metadata")
	display.querySelector(".songname").innerHTML = metadata.songname
	display.querySelector(".artistname").innerHTML = metadata.artistname
	display.querySelector(".album").innerHTML = metadata.album

	Player.setColorScheme(metadata.colorScheme)
}

Player.load = function(streamURL, metadata) {
	//show loading animation
	document.getElementById("loading-animation").classList.remove("hidden")
	document.getElementById("listen-live-btn").classList.add("hidden")

	// load audio data
	audioLoad = new Promise((resolve, reject) => {
		audio = document.createElement('audio')
		audio.id = ""
		audio.src = streamURL
		audio.crossOrigin = 'anonymous'

		audio.oncanplay = () => resolve(audio)
	})

	//load color scheme
	metadataLoad = Promise.all([
		window.fetch("/api/metadata")
		.then(res => res.json()),

		window.fetch("/api/color_scheme")
		.then(res => res.json())
	])
	.then(function(data){
		data[0].colorScheme = data[1]
		return data[0]
	})

	Promise.all([audioLoad, metadataLoad])
	.then(function(data){
		return {
			audio: data[0],
			metadata: data[1]
		}
	})
	.then(function(data){
		document.getElementById("Home").classList.remove("hidden");
		document.getElementById("title").classList.add("hidden");

		Player.render(data.metadata)

		Visualizer.load(data.audio, document.getElementById("visualizer"))

		Player.audio = data.audio;
		Player.audio.play();
	})

	Player.socket = io("http://localhost");
	Player.socket.on("newData", function(data){
		console.log(data)

		Player.render(data)
	})
}