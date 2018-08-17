const render_program_button = function(program_data) {
	const template = document.getElementById("program-template")
	let new_button = template.cloneNode(true);

	console.log(program_data)

	new_button.querySelector("img.image")
	.setAttribute("src", program_data.image || "http://assets.podomatic.net/ts/37/11/dc/cakiral/1400x1400_11741854.jpg")

	new_button.querySelector("div > .name")
	.innerHTML = program_data.name || "name not found"

	new_button.querySelector("div > .authors")
	.innerHTML = program_data.author || "author not found"

	new_button.classList.remove("template")

	console.log(new_button)

	document.getElementById("recent-shows").appendChild(new_button)
}

window.addEventListener("load", function(){
	fetch("api/programs")
	.then(res => res.json())
	.then(body => body.splice(0, 10).forEach(program => render_program_button(program)))

	fetch("api/episodes?program=sendnudes")
	.then(res => res.json())
	.then(body => console.log(body))
})