let Programs = {};

Programs.switchTo = function(event, tab){
	Array.prototype.forEach.call(
		document.querySelectorAll("#recent-shows > .tab"),
		tab => tab.classList.add("hidden")
	);

	console.log(document.getElementById(tab))
	document.getElementById(tab).classList.remove("hidden")
}

const render_program_button = function(program_data) {
	const template = document.getElementById("program-template")
	let new_button = template.cloneNode(true);

	new_button.querySelector("img.image")
	.setAttribute("src", program_data.image || "http://assets.podomatic.net/ts/37/11/dc/cakiral/1400x1400_11741854.jpg")

	new_button.querySelector("div > .name")
	.innerHTML = program_data.name || "name not found"

	new_button.querySelector("div > .authors")
	.innerHTML = program_data.author || "author not found"

	new_button.onclick = function(){
		render_episode_list(program_data.shortname)
		Programs.switchTo(event, "episodes")
	}

	new_button.classList.remove("template")

	document.getElementById("programs").appendChild(new_button)
}

const render_episode_button = function(episode_data) {
	const template = document.getElementById("episode-template")
	let new_button = template.cloneNode(true)

	new_button.querySelector(".play-button")
	.setAttribute("onclick", "function(){console.log('play')}")

	new_button.querySelector(".title")
	.innerHTML = episode_data.name

	new_button.querySelector(".description")
	.innerHTML = episode_data.description

	new_button.classList.remove("template")
	document.getElementById("episodes").appendChild(new_button)
}

const render_episode_list = function(program_name){
	fetch("api/episodes?program=" + program_name + "")
	.then(res => res.json())
	.then(body => body.splice(0, 10))
	.then(body => body.forEach(episode => render_episode_button(episode)))
	// .then(body => body.forEach(episode => console.log(episode)))
	// .catch(err => console.log(err.message))

	document.getElementById("episodes").innerHTML = "";

}

window.addEventListener("load", function(){
	fetch("api/programs")
	.then(res => res.json())
	.then(body => body.splice(0, 10).forEach(program => render_program_button(program)))
})