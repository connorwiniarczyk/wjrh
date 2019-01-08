let Programs = {};

Programs.switchTo = function(event, tab){
	Array.prototype.forEach.call(
		document.querySelectorAll("#recent-shows > .tab"),
		tab => tab.classList.add("hidden")
	);

	console.log(document.getElementById(tab))
	document.getElementById(tab).classList.remove("hidden")
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
		program (id: ${program_name}) {
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

const load_programs = async function(){
	const query = `{
		programs (limit_to: 20, deep: false) {
			name,
			author,
			image,
			description,
			shortname
		}
	}`

	const appendTarget = document.getElementById("program-list")

	const data = await Utils.tealQuery(query)
	const links = data.programs.map(Dom_Templates.program_link)
	
	links.forEach(link => appendTarget.appendChild(link))
}

const load_program = async function({name}){
	const query = `{
		program (shortname: "${name}") {
			name, 
			description,
			shortname,
			author,
			image,
			episodes {
				name,
				description,
				audio_url
			}
		}
	}`

	const data = await Utils.tealQuery(query)

	console.log(data)

	const episode_links = data.program.episodes.map(Dom_Templates.episode_link)

	console.log(episode_links)

	// const appendTarget = document.getElementById
}

window.addEventListener("load", load_programs)
window.addEventListener("load", () => load_program({name: "sendnudes"}))