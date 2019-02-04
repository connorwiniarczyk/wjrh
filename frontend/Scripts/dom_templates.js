DomTemplate = {}

// take an html string and return a dom element defined by that string
DomTemplate.render = function(html) {
	const template = document.createElement('template')
	template.innerHTML = html.trim()
	return template.content
}

DomTemplate["song-metadata"] = function({ track, episode, program }){
	const template = `
		${track ? `<h2>${track.title} - ${track.artist}</h2>` : ""}
		${track && track.album ? `<h3>${track.album}</h3>` : ""}
		${track ? `<br/>` : ""}
		${program ? `<h2>${program.name}</h3>` : ""}
		${program ? `<h2>${program.author}</h3>` : ""}`

	return DomTemplate.render(template)
}

DomTemplate["program-link"] = function({ name, author, image, shortname }){
	const defaultImage = "http://assets.podomatic.net/ts/37/11/dc/cakiral/1400x1400_11741854.jpg"

	const template = `
		<li>
		<a class="list__program-link" href="#programs"
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

DomTemplate["episode-link"] = function({episode, program}) {
	const template = `
		<li class="">
			<a 	class="episode-link" 
				href="#listen?episode=${episode.id}&program=${program.shortname}" '>

				<button class="episode-link__play-btn btn play-pause-btn play"></button>
				<h3 class="episode-link__name">${episode.name}</h3>
				<p class="episode-link__description">${Utils.escapeHtml(episode.description || "")}</p>
			</a>
		</li>`

	return DomTemplate.render(template)
}

DomTemplate["schedule__cell--show"] = function(data, { raw }) {
	const template = `
		<td class="
			schedule__cell
			schedule__cell--show
			${data.day}
		">
			<a href="#">
				<p>${data.name || ""}</p>
				<p>${data.author || ""}</p>
			</a>
		</td>`

	if(raw)	return template
	else 	return DomTemplate.render(template)
}

DomTemplate["schedule-row"] = function(data) {
	const template = `
		<tr data-hour="${data.time.range.start}"  class="schedule__row">
			<td class="schedule__cell schedule__cell--timeslot">
				${data.time.string}
			</td>

			${DomTemplate["schedule__cell--show"](
				{day:"monday", ...data.mon},
				{raw: true}
			)}

			${DomTemplate["schedule__cell--show"](
				{day:"tuesday", ...data.tue},
				{raw: true}
			)}

			${DomTemplate["schedule__cell--show"](
				{day:"wednesday", ...data.wed},
				{raw: true}
			)}

			${DomTemplate["schedule__cell--show"](
				{day:"thursday", ...data.thu},
				{raw: true}
			)}

			${DomTemplate["schedule__cell--show"](
				{day:"friday", ...data.fri},
				{raw: true}
			)}

			${DomTemplate["schedule__cell--show"](
				{day:"saturday", ...data.sat},
				{raw: true}
			)}

			${DomTemplate["schedule__cell--show"](
				{day:"sunday", ...data.sun},
				{raw: true}
			)}

		</tr>`

	return DomTemplate.render(template)
}