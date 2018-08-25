const loadPlayer = function(streamURL, metadata) {
	//show loading animation
	document.getElementById("loading-animation").classList.remove("hidden")
	document.getElementById("listen-live-btn").classList.add("hidden")

	// load audio data
	audioLoad = new Promise((resolve, reject) => {
		audio = document.createElement('audio')
		audio.id = ""
		audio.src = streamURL
		audio.crossOrigin = 'anonymous'

		audio.oncanplay = resolve

		document.getElementById("Home").appendChild(audio)

		
	})

	audioLoad.then(message => {
		console.log("loaded")
		document.getElementById("Home").classList.remove("hidden");
		document.getElementById("title").classList.add("hidden");
	})

	audioLoad.catch(err => console.log(err.message))

	// load image
	imageLoad = window.fetch("/api/artwork")
	.then(body => {
		document.getElementById("Home").classList.remove("hidden");
		document.getElementById("title").classList.add("hidden");
	})

	//load color scheme
	colorLoad = window.fetch("/api/color_scheme")
	.then(res => res.json())
	.then(body => "rgb(" + body.Secondary[0] + ", " + body.Secondary[1] + ", " + body.Secondary[2] + ")")
	.then(scheme => document.getElementById("Home").style.background = scheme)
}