const Player = {}

Player.socket;
Player.audio;

Player.play = function(){}
Player.pause = function(){}

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

Player.setColorScheme = function(scheme){
	document.getElementById("Home").style.background = toStyle(scheme.Secondary)
	Visualizer.setColor(scheme.Primary)
}

Player.render = function(metadata){
	default_image = ""

	// update image
	document.querySelector(".album-art > .content")
	.style["background-image"] = "url('" + (metadata.image || default_image) + "')"

	// update metadata
	display = document.getElementById("metadata")
	display.querySelector(".songname").innerHTML = metadata.songname
	display.querySelector(".artistname").innerHTML = metadata.artistname
	display.querySelector(".album").innerHTML = metadata.album
	display.querySelector(".showname").innerHTML = metadata.title
	display.querySelector(".author").innerHTML = metadata.author

	console.log(metadata)

	Player.setColorScheme(metadata.colorScheme)
}

Player.init = function(){
	document.getElementById("loading-animation").classList.remove("hidden")
	document.getElementById("listen-live-btn").classList.add("hidden")

	Player.audio = document.createElement('audio')
	Player.audio.crossOrigin = 'anonymous'

	Visualizer.load(Player.audio, document.getElementById("visualizer"))

	Player.socket = io("http://localhost")
}

Player.load = function(streamURL, metadata) {
	if(Player.audio == null) Player.init()

	audioLoad = new Promise((resolve, reject) => {
		Player.audio.src = streamURL;
		Player.audio.load();
		Player.audio.oncanplay = resolve
	})

	if(metadata == "LIVE"){
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
	} else {
		metadataLoad = Promise.resolve({
			title: metadata.program_data.name,
			author: metadata.program_data.author,
			image: metadata.program_data.image,
			colorScheme: {
				Primary: [200, 200, 200],
				Secondary: [33, 33, 33]
			}
		})
	}

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
		Player.audio.play();
	})

	if(metadata == "LIVE"){
		Player.socket.on("newData", function(data){
			Player.render(data)
		})
	} else {
		Player.socket.removeAllListeners("newData")
	}
}