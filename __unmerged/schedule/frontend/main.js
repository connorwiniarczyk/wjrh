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

DomTemplate["schedule-row"] = function(timeslot, data) {
	const template = `
		<tr class="hour">
			<td class="hours">
				${timeslot} - ${parseInt(timeslot) + 1}
			</td>
			<td class="day day--mon">${data.monday.name || ""}</td>
			<td class="day day--tue">${data.tuesday.name || ""}</td>
			<td class="day day--wed"></td>
		</tr>`

	return DomTemplate.render(template)
}

Schedule = {}

/**
 *	Right now, our schedule data is indexed by day, and then by time of day
 *	in order to make it easier to read. However, since HTML mandates that tables
 *	be indexed by row, and then by column, we need to re-index our data before
 *	we can insert it into the page
 */
Schedule.row_index = function(data){
	const rows = {}
	for(const key_day in data.days) {
		// get an object of all the shows in that day
		const day = data.days[key_day]

		for(const key_timeslot in day) {
			const show = day[key_timeslot]

			if(rows[key_timeslot] == undefined) rows[key_timeslot] = {}
			rows[key_timeslot][key_day] = show
		}
	}

	return rows
}

Schedule.render = async function(){
	const request = fetch("http://10.0.0.146/schedule").then(res => res.json())
	const data = await request

	const rows = Schedule.row_index(data)

	const elements = Object.keys(rows)
	.map(key => DomTemplate["schedule-row"](key, rows[key]))

	const appendTarget = document.getElementById("schedule")

	elements.forEach(row => appendTarget.appendChild(row))

	console.log(elements)
}

window.addEventListener('load', Schedule.render)