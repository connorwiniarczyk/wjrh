let Dom_Templates = {}

Dom_Templates.program = function(data){}

Dom_Templates.program_link = function(data){
	const template = document.getElementById("program-template")
	let output = template.cloneNode(true);

	output.classList.remove("template")
	output.id = ""

	output.style["background-image"] = `url(${data.image || "http://assets.podomatic.net/ts/37/11/dc/cakiral/1400x1400_11741854.jpg"})`
	// .setAttribute("src", data.image || "http://assets.podomatic.net/ts/37/11/dc/cakiral/1400x1400_11741854.jpg")

	output.querySelector(".name")
	.innerHTML = data.name || "name not found"

	output.querySelector(".info > .title")
	.innerHTML = `${data.name}`

	output.querySelector(".info > .authors")
	.innerHTML = data.author || "author not found"

	output.onclick = function() {
		render_episode_list(data.shortname)
		Programs.switchTo(event, "episodes")
	}

	return output;
}

Dom_Templates.episode_link = function(data) {
	const html = `
		<li><a href="#">
			<span class="title">${data.name}</span>
		</a></li>`

	const template = document.createElement('template')
	template.innerHTML = html.trim()
	return template.content.firstChild
}

// Dom_Templates.episode_link = function(data){
// 	const template = document.getElementById("program-template")
// 	let output = template.cloneNode(true);

// 	output.classList.remove("template")
// }