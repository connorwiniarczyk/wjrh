//variable definitions
let play_pauseButton;
let music;
let visualizer;

let socket;

//Global Event Streams
let metadata, artwork

// Tab Navigation
const switchTo = function(event, tab) {
	//set all tabs to hidden
	Array.prototype.forEach.call(document.getElementsByClassName("tab"), tab => tab.classList.add("hidden"))

	// set all tab buttons to default
	console.log(document.getElementById("site-nav").children)
	Array.prototype.forEach.call(document.getElementById("site-nav").children, element => element.classList.remove("active"))

	document.getElementById(tab).classList.remove("hidden")

	// set active tab to active
	event.currentTarget.classList.add("active")
}

window.addEventListener("load", function(){
	tabs = {
		about_us: 		document.getElementById("about-us"),
		schedule: 		document.getElementById("schedule"),
		recent_shows: 	document.getElementById("recent-shows"),
		contact_us: 	document.getElementById("contact-us")
	};

	console.log(Object.keys(tabs).map(key => tabs[key]))
	// Object.keys(tabs).forEach(key => tabs[key].classList.add("hidden"))
});

window.addEventListener("load", function(){
	window.onresize();
	socket = io();

	metadata = Bacon.fromEvent(socket, "newData")
	artwork = Bacon.fromEvent(socket, "UpdateArtwork")

	// metadata.onValue(renderSongInfo)
	// artwork.onValue(url => {
	// 	document.getElementsByClassName("album-art")[0].style.background = "url("+ url +")"
	// 	document.getElementsByClassName("album-art")[0].style.backgroundSize = "cover"
	// 	document.getElementsByClassName("album-art")[0].style.backgroundRepeat = "no-repeat"
	// })

	// fetch("api/color_scheme")
	// .then(body => body.json())
	// .then(json => json.Secondary)
	// .then(secondary => "rgb(" + secondary[0] + ", " + secondary[1] + ", " + secondary[2] + ")")
	// .then(scheme => document.getElementById("Home").style.background = scheme)
	// .then(scheme => console.log(scheme))

	play_pauseButton = document.getElementById("play-pause-button");

	let playing = false;
	play_pauseButton.onclick = function(){
		if(playing){
			document.getElementsByTagName("audio")[0].pause()
			playing = false;
		} else {
			document.getElementsByTagName("audio")[0].play()
			playing = true;
		}
	}
});

window.onresize = function(){
	// var player = document.getElementsByClassName("album-art")[0];
	// var songInfo = document.getElementsByClassName("song-info")[0];

	// player.style.height = "" + player.getBoundingClientRect().width + "px";
	// songInfo.style.height = "" + player.getBoundingClientRect().width + "px";
};

// Load the rest of the scripts asynchronously
// window.addEventListener("load", function(){
// 	Promise.all([
// 		fetch("api/getScript?script=handlebars"),
// 		fetch("api/getScript?script=socket.io"),
// 		fetch("api/getScript?script=render"),
// 		fetch("api/getScript?script=about_us")
// 	])
// })

/**
 *	Handles sidebar toggling
 * TODO: this should really be made more intuitive at some point
 */
// window.addEventListener("load", function(){
// 	const btn = document.getElementById("slide-out-button");
// 	const sidebar = document.getElementById("sidebar");
// 	const content = document.getElementById("content");

// 	const sidebarToggle = Bacon.fromEvent(btn, "click").map(() => {
// 		return sidebar.className.split(' ').includes("out");
// 	}).log();

// 	sidebarToggle.onValue(toggled => {
// 		if(toggled)		sidebar.className = "";
// 		else 			sidebar.className += " out"
// 	});

// 	sidebarToggle.onValue(toggled => {
// 		if(toggled)		content.className = "";
// 		else 			content.className += " out"
// 	});

// 	sidebarToggle.onValue(toggled => {
// 		if(toggled)		btn.className = "";
// 		else 			btn.className += " out"
// 	});
// })