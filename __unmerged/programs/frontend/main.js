Utils = {}

Utils.query = null;

Utils.tealQuery = async function(query) {

	// build our HTTP POST request
	const request = fetch("http://45.55.38.183:4000/graphql", {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({query: query, raw: true}),
		method: "POST"
	})

	Utils.query = request

	const result = await Utils.query.then(res => res.json())

	if(result.errors) throw result.errors[0]

	return result.data
}

Utils.escapeHtml = function(unsafe) {
    return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
 }




DomTemplate = {}

// take an html string and return a dom element defined by that string
DomTemplate.render = function(html) {
	const template = document.createElement('template')
	template.innerHTML = html.trim()
	return template.content
}

DomTemplate["program-link"] = function({ name, author, image, shortname }){
	const defaultImage = "http://assets.podomatic.net/ts/37/11/dc/cakiral/1400x1400_11741854.jpg"

	const template = `
		<li>
		<a class="list__program-link" href="#"
			onclick="Programs.LoadProgram('${shortname}')">

			<img src="${image || defaultImage}" alt="${name}"></img>
			<span>${name}</span>
		</a>
		</li>`

		return DomTemplate.render(template)
}

DomTemplate["program-details"] = function({ name, author, image, description }){
	const template = `
		<img class="program-details__image" src="${image}" alt="">
		<h2 class="program-details__name">${name}</h2>
		<h3 class="program-details__author">${author}</h3>
		<p class="program-details__description">
			${Utils.escapeHtml(description || "")}
		</p>`

	return DomTemplate.render(template)
}

DomTemplate["episode-link"] = function(data) {
	const template = `
		<li class="">
			<a class="episode-link" href="#">
				<button class="episode-link__play-btn btn play-pause-btn play"></button>
				<h3 class="episode-link__name">${data.name}</h3>
				<p class="episode-link__description">${Utils.escapeHtml(data.description || "")}</p>
			</a>
		</li>`

	return DomTemplate.render(template)
}

Programs = {}

Programs.LoadPrograms = async function(search_param){

	const query = `{
		programs (
			search_param: "${search_param || ""}",
			limit_to: 30,
			deep: false,
		){
			name,
			author,
			image,
			description,
			shortname
		}
	}`

	const data = await Utils.tealQuery(query)
	const links = data.programs.map(program => DomTemplate["program-link"](program))

	const appendTarget = document.getElementById("programs-list")
	appendTarget.innerHTML = ""
	links.forEach(link => appendTarget.appendChild(link))
}

Programs.LoadProgram = async function(shortname){
	const query = `{
		program(shortname: "${shortname}"){
			name,
			author,
			image,
			description,
			episodes{
				name,
				description,
				audio_url
			}
		}
	}`

	const data = await Utils.tealQuery(query)

	const details = DomTemplate["program-details"](data.program)
	const target = document.querySelector(".program-details")

	target.innerHTML = ""
	target.appendChild(details)

	console.log(details)

	const links = data.program.episodes.map(DomTemplate["episode-link"])

	appendTarget = document.getElementById("program-episodes")
	appendTarget.innerHTML = ""
	links.forEach(link => appendTarget.appendChild(link))

	Programs.switchTo(1)
}

window.addEventListener("load", () => Programs.LoadPrograms())
window.addEventListener("load", function(){
	const tab_nodes = document.querySelectorAll("section.programs > .tab")
	const tabs = toArray(tab_nodes)

	Programs.tabs = new TabMenu(tabs)
	Programs.switchTo = Programs.tabs.switchTo.bind(Programs.tabs)
})

window.addEventListener("load", function(){
	const searchbar = document.getElementById("program-search")

	searchbar.onkeydown = function(){
		const param = searchbar.value
		Programs.LoadPrograms(param)
	}
})
