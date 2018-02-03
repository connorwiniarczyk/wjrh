/**
 * Uses the handlebars extension to render a given set of metadata
 * into html and append it to the dom
 *
 * @param      {Object}  metadata  The metadata we want to render
 */
const renderSongInfo = function(metadata){
	container = document.getElementsByClassName("song-info")[0];
	container.innerHTML = "";

	var html = document.getElementById("template").innerHTML;

	var template = Handlebars.compile(html);

	var songInfo = document.createElement("div");
	songInfo.innerHTML = template(metadata);

	container.appendChild(songInfo);
}