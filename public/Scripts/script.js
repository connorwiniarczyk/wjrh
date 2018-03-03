//variable definitions
let play_pauseButton;
let music;
let visualizer;

let socket;

//Global Event Streams
let metadata, artwork, colorScheme

// let img = document.createElement("img")


window.addEventListener("load", function(){
	window.onresize();
	socket = io();

	let img = document.createElement("img")

	metadata = Bacon.fromEvent(socket, "newData")
	artwork = Bacon.fromEvent(socket, "UpdateArtwork")
	colorScheme = Bacon.fromEvent(img, "load").map(img => makeColorScheme(img.target)).log()


	metadata.onValue(renderSongInfo)
	artwork.onValue(url => img.setAttribute('src', "/api/artwork?" + new Date().getTime()))
	artwork.onValue(url => {
		document.getElementsByClassName("album-art")[0].style.background = "url("+ url +")"
		document.getElementsByClassName("album-art")[0].style.backgroundSize = "cover"
		document.getElementsByClassName("album-art")[0].style.backgroundRepeat = "no-repeat"
	})

	colorScheme.onValue(scheme => document.getElementById("html").style.background = scheme.secondary)


	play_pauseButton = document.getElementById("play-pause-button");

	let playing = false;
	play_pauseButton.onclick = function(){
		if(playing){
			document.getElementById("audio").pause()
			playing = false;
		}else{
			document.getElementById("audio").play()
			playing = true;
		}
	}
});

window.onresize = function(){
	var player = document.getElementsByClassName("album-art")[0];
	var songInfo = document.getElementsByClassName("song-info")[0];

	player.style.height = "" + player.getBoundingClientRect().width + "px";
	songInfo.style.height = "" + player.getBoundingClientRect().width + "px";
};




const makeColorScheme = function(img){
	var swatches = new Vibrant(img).swatches();

	return {
		primary: chooseFrom([
			"LightVibrant",
			"Vibrant",
			"DarkVibrant"
		])(swatches).getHex(),
		secondary: chooseFrom([
			"DarkMuted",
			"Muted",
			"LightMuted",
			"DarkVibrant"
		])(swatches).getHex()
	}
}

Object.resolve = function(obj, path) {
	return path.split('.').reduce((prev, cur) => {
		return prev ? prev[cur] : undefined
	}, obj || self)
}

const chooseFrom = (paths, Default) => obj => {
	return paths.reduce((prev, cur) => {
		return prev || Object.resolve(obj, cur)
	}, Object.resolve(obj, paths[0])) || Default
}


/**
 *	Handles sidebar toggling
 * TODO: this should really be made more intuitive at some point
 */
window.addEventListener("load", function(){
	const btn = document.getElementById("slide-out-button");
	const sidebar = document.getElementById("sidebar");
	const content = document.getElementById("content");

	const sidebarToggle = Bacon.fromEvent(btn, "click").map(() => {
		return sidebar.className.split(' ').includes("out");
	}).log();

	sidebarToggle.onValue(toggled => {
		if(toggled)		sidebar.className = "";
		else 			sidebar.className += " out"
	});

	sidebarToggle.onValue(toggled => {
		if(toggled)		content.className = "";
		else 			content.className += " out"
	});

	sidebarToggle.onValue(toggled => {
		if(toggled)		btn.className = "";
		else 			btn.className += " out"
	});

	//Set Sidebar to be the primary color
	colorScheme.onValue(scheme => btn.style.color = scheme.primary)
})