Schedule = {}

Schedule.update_day = function(){
	const date = new Date()
	const today = date.getDay()

	const today_string = `
		${ today == 0 ? "sunday" 	: 	""}\
		${ today == 1 ? "monday" 	: 	""}\
		${ today == 2 ? "tuesday" 	: 	""}\
		${ today == 3 ? "wednesday" : 	""}\
		${ today == 4 ? "thursday" 	: 	""}\
		${ today == 5 ? "friday" 	: 	""}\
		${ today == 6 ? "saturday" 	: 	""}\
	`.trim()

	Utils.DomQuery(`
		.schedule__cell--show,
		.schedule__cell--heading`
	)
	.forEach(cell => cell.classList.remove('today'))

	Utils.DomQuery(`
		.schedule__cell--show.${today_string},
		.schedule__cell--heading.${today_string}`
	)
	.forEach(cell => cell.classList.add('today'))
}

Schedule.update_time = function(){
	const date = new Date()
	const hour = date.getHours()

	Utils.DomQuery(`.schedule__row`)
	.forEach(elem => elem.classList.remove("live"))

	Utils.DomQuery(`.schedule__row[data-hour="${hour}"]`)
	.forEach(elem => elem.classList.add("live"))

	Utils.DomQuery(`.schedule__row[data-hour="${hour}"]`)[0]
	.scrollIntoView(true)
}

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
	const request = fetch("http://localhost:80/api/schedule").then(res => res.json())
	const data = await request

	// made a change to the way the schedule is stored,
	// function isn't necessary at the moment
	// const rows = Schedule.row_index(data)

	const elements = data.map(timeslot => DomTemplate["schedule-row"](timeslot))
	const appendTarget = Utils.DomQuery("tbody")[0]

	appendTarget.innerHTML = ""
	elements.forEach(row => appendTarget.appendChild(row))

	Schedule.update_day()
	Schedule.update_time()
}

window.addEventListener('load', Schedule.render)