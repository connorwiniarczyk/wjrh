/**
 * Creates a new Music object with a given audio source
 *
 * @class      Music (src)
 * @param      {String:URL}  src     A url pointing to the source of the audio stream
 */
const Music = function(src){
	this.Audio = document.createElement('audio');
	this.Audio.src = src;
	this.Audio.crossOrigin = 'anonymous';

	this.isPaused = true;
	this.loaded = false;

	this.metadata = {};
};

//with Functions

/**
 * The controller is a DOM element that the user can use to interact with the music playback
 * 
 *
 * @param      {DOM element}  controller  The controller
 * @return     {Object}  { this object }
 */
Music.prototype.withController = function(controller){
	this.controller = controller;

	return this;
};

Music.prototype.load = function(callback){
	//tell the controller we are in the loading state
	this.controller.className = "loading";

	this.Audio.load();
	this.Audio.oncanplay = function(){
		this.loaded = true;
		callback();
	}.bind(this);
};

Music.prototype.play = function(){
	//tell the controller we are in the play state
	this.controller.className = "play";

	if(this.loaded){
		this.Audio.play();
		this.isPaused = false;
	} else {
		this.load(this.play.bind(this));
	}
};

Music.prototype.pause = function(){
	//tell the controller we are in the paused state
	this.controller.className = "paused";

	this.Audio.pause();
	this.isPaused = true;

	console.log("paused");
};

Music.prototype.togglePaused = function(){
	this.isPaused ? this.play() : this.pause();
	console.log(this.isPaused);
};

Music.prototype.loadMetaData = function(callback){	
	let url = "https://api.teal.cool/organizations/wjrh/latest";

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = (function(music){
		return function(){
			if(this.readyState == 4 && this.status == 200){
				music.metadata = JSON.parse(this.responseText);
				callback(this.metadata);
			}
		};
	})(this);
	// xhttp.open("GET", "https://api.teal.cool/organizations/wjrh/latest", true);
	xhttp.open("GET", "/api/metadata");
	xhttp.send();
};