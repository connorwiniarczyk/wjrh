//variable definitions
let play_pauseButton;
let music;
let visualizer;

let socket;

window.onload = function(){

	socket = io();

	socket.on("newData", renderSongInfo);
	socket.on("UpdateArtwork", function(url){
		var img = document.createElement("img");
		img.setAttribute('src', "/api/artwork?" + new Date().getTime());

		// img.setAttribute('src', 'api/artwork?date=' + new Date().getTime());

		img.addEventListener('load', function(){
			let colorScheme = makeColorScheme(img);
			visualizer.setColor(colorScheme.primary);
			document.getElementById("new-visualizer").style.background = colorScheme.secondary;
		});
		document.getElementById("Album-Art").style.background = "url("+ url +")"
		document.getElementById("Album-Art").style.backgroundSize = "cover"
		document.getElementById("Album-Art").style.backgroundRepeat = "no-repeat"
	});

	window.onresize();
	play_pauseButton = document.getElementById("play-pause-button");

	music = new Music("http://www.wjrh.org:8000/WJRH").withController(play_pauseButton);
	music.loadMetaData(function(){
		// console.log(music.metadata);
		// renderSongInfo(music.metadata);
	});

	canvas = document.getElementById("visualizer");
	visualizer = new audioVisualizer(
		music.Audio
	).withDomVisualizer(createDomVisualizer( "#333" ));

	play_pauseButton.onclick = function(){
		music.togglePaused();
		visualizer.play();
	};
};

window.onresize = function(){
	// renderSongInfo({title: "Misc. Songs"});
	var player = document.getElementById("Album-Art");
	var songInfo = document.getElementById("song-info");

	player.style.height = "" + player.getBoundingClientRect().width + "px";
	songInfo.style.height = "" + player.getBoundingClientRect().width + "px";
};


const makeColorScheme = function(img){
	var swatches = new Vibrant(img).swatches();

	return {
		primary: swatches.LightVibrant.getHex(),
		secondary: swatches.DarkMuted.getHex()
	};
}