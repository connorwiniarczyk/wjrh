const Player = {}

Player.audio = document.createElement('audio')
Player.metadata = {}

Player.setColorScheme = function(scheme) {
	document.getElementById("Home").style.background = toStyle(scheme.Secondary)
	Visualizer.setColor(scheme.Primary)
}

Player.load = function(streamURL, metadata) {
	//show loading animation
	document.getElementById("loading-animation").classList.remove("hidden")
	document.getElementById("listen-live-btn").classList.add("hidden")

	if(metadata == "LIVE") {

	} else {
		Player.metadata = metadata;
	}

	// load audio data
	audioLoad = new Promise((resolve, reject) => {
		audio = document.createElement('audio')
		audio.id = ""
		audio.src = streamURL
		audio.crossOrigin = 'anonymous'

		audio.oncanplay = resolve

		document.getElementById("Home").removeChild(Player.audio)
		Player.audio = audio
	})

	audioLoad.then(message => {
		Player.audio.play()

		document.getElementById("Home").appendChild(Player.audio)
		Visualizer.load(Player.audio, document.getElementById("visualizer"))
	})

	// load image
	imageLoad = window.fetch("/api/artwork")
	.then(body => {
		document.getElementById("Home").classList.remove("hidden");
		document.getElementById("title").classList.add("hidden");
	})

	//load color scheme
	colorLoad = window.fetch("/api/color_scheme")
	.then(res => res.json())
	.then(body => Player.metadata.colorScheme = body)//Player.setColorScheme) // => "rgb(" + body.Secondary[0] + ", " + body.Secondary[1] + ", " + body.Secondary[2] + ")")
	// .then(scheme => document.getElementById("Home").style.background = scheme)

	Promise.all([audioLoad, imageLoad, colorLoad])
	.then(function(values){
		document.getElementById("Home").classList.remove("hidden");
		document.getElementById("title").classList.add("hidden");

		Player.setColorScheme(Player.metadata.colorScheme)
	})
}

window.addEventListener("load", function(){
	document.getElementById("Home").appendChild(Player.audio)
})