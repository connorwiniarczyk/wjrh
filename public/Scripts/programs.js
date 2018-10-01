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

const render_episode_link = function(episode_data, program_data) {
	let newEpisode = document.getElementById("episode-template").cloneNode(true)

	newEpisode.onclick = function(){
		Player.load("/api/listen?id=" + (episode_data.id || ""), {episode_data: episode_data, program_data: program_data})
	}

	newEpisode.querySelector(".title")
	.innerHTML = episode_data.name

	newEpisode.querySelector(".description")
	.innerHTML = episode_data.description

	newEpisode.classList.remove("template")
	document.getElementById("episodes").appendChild(newEpisode)
}

const render_episode_list = function(program_name){
	Utils.tealQuery(`{
		program (id: "` + program_name + `") {
			name, 
			description,
			shortname,
			author,
			image,
			episodes {
				name,
				description,
				id
			}
		}
	}`)
	.then(data => data.program.episodes
		.forEach(episode => render_episode_link(episode, data.program))
	)

	document.getElementById("episodes").innerHTML = "";
}

window.addEventListener("load", function(){
	Utils.tealQuery(`{
		programs {
			name,
			author,
			image,
			description,
			shortname
		}
	}`)
	.then(data => data.programs.forEach( program => render_program_button(program) ))
})