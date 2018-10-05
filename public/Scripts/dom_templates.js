let Dom_Templates = {}

Dom_Templates.program = function(data){}

Dom_Templates.program_link = function(data){
	const template = document.getElementById("program-template")
	let output = template.cloneNode(true);

	output.classList.remove("template")
	output.id = ""


	output.querySelector("img.image")
	.setAttribute("src", data.image || "http://assets.podomatic.net/ts/37/11/dc/cakiral/1400x1400_11741854.jpg")

	output.querySelector("div > .name")
	.innerHTML = data.name || "name not found"

	output.querySelector("div > .authors")
	.innerHTML = data.author || "author not found"

	output.onclick = function(){
		render_episode_list(data.shortname)
		Programs.switchTo(event, "episodes")
	}

	return output;
}

Dom_Templates.episode_link = function(data){
	const template = document.getElementById("program-template")
	let output = template.cloneNode(true);

	output.classList.remove("template")


}