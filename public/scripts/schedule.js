// generate arrays containing every day of the week as well as every hour
const weekdays = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] 
const hours = Array.apply(0, Array(24)).map((value, index) => `${index}:00`)

const schedule_query = `
query {
	schedule{
		shortname
		day_number
		start_hour
		end_hour
		program {
			name
			author
		}
	}
}`

async function render_schedule(){
	const schedule = document.querySelector(".schedule")
	const newTimeslot = clone_template('#template--timeslot', {})

	weekdays.forEach(function(day, index){
		newElement = clone_template('#template--day', {day})
		newElement.style['grid-column-start'] = index + 1
		newElement.style['grid-row-start'] = 1
		schedule.appendChild(newElement)
	})

	hours.forEach(function(hour, index){
		newElement = clone_template('#template--hour', {hour})
		newElement.style['grid-column-start'] = 1
		newElement.style['grid-row-start'] = index + 2
		schedule.appendChild(newElement)
	})

	const result = await send_graphql_query("http://api.wjrh.org", schedule_query, {})
	const timeslots = result.schedule
	
	timeslots.forEach(function(timeslot){
		newElement = clone_template('#template--timeslot', {
			name: timeslot.program.name || `/${timeslot.shortname}`,
			...timeslot
		})
		newElement.style['grid-column-start'] = timeslot.day_number + 1
		newElement.style['grid-row-start'] = timeslot.start_hour
		newElement.style['grid-row-end'] = timeslot.end_hour

		schedule.appendChild(newElement)
	})
}

window.addEventListener("load", render_schedule)
