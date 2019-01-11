const parse_csv_callback = require('csv').parse
const fs = require('fs')
const path = require('path')

/**
 *	wrap parse_csv_callback in a Promise based API, this lets us use
 *	the await keyword and improves the readability of
 *	our code
 */
const parse_csv = function(path, options) {
	return new Promise(function(resolve, reject){
		parse_csv_callback(path, options, function(err, result){
			if(err){
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}


const csv_path = path.join(__dirname, '/schedule.csv')
const csv_string = fs.readFileSync(csv_path)

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const options = {
	columns: ['time', ...days]
}

const to_json = function(cell) {
	const name = cell
		.replace(/\[.*?\]/g, "")
		.replace(/\(.*?\)/g, "")
		.trim()

	const author = cell.match(/(?<=\[).+?(?=\])/g)
	const tags = cell.match(/(?<=\().+?(?=\))/g)

	return { name, author, tags }
}

/**
 *	expects input of the form "\d+ - \d+ (AM | PM)"
 *	ex.	"2 - 7 AM", "10 - 11 PM" etc.
 */
const get_time_range = function(string){
	const regex = /(\d+) *- *(\d+) *(am|pm)/ig
	const result = regex.exec(string)

	if(result == null) throw `error: bad time expression (${string})`

	let start_12h = parseInt(result[1])
	let end_12h = parseInt(result[2])
	const am_pm = result[3]

	// convert from 12 to 24 hour time

	const conversion_end = am_pm.match(/pm/i) ? 12 : 0

	// 12 AM becomes 0 in 24 hour time
	if(start_12h == 12	&& conversion_end == 0) start_12h = 0
	if(end_12h == 12 	&& conversion_end == 0) end_12h = 0

	// Right now, the AM or PM in the time expression only
	// applies to the end_12h time. The am_pm of the start_12h time is 
	// not stated explicitly, and so needs to be inferred

	let conversion_start

	// not a perfect solution, but if start_12h > end_12h, than assume
	// one is PM and the other AM
	// TODO: need a more robust system for encoding the schedule
	if(start_12h > end_12h) conversion_start = am_pm.match(/pm/i) ? 0 : 12
	else					conversion_start = am_pm.match(/pm/i) ? 12 : 0

	const start = start_12h + conversion_start
	const end = end_12h + conversion_end

	return { start, end }
}

exports.parse = async function(){
	const data_raw = await parse_csv(csv_string, options)

	const data = data_raw.map(function(timeslot){
		const output = {}

		Object.keys(timeslot).forEach(function(key){
			if(key == "time") {
				const string = timeslot[key]
				const range = get_time_range(string)

				output[key] = {string, range}
			} else {
				output[key] = to_json(timeslot[key])
			}
		})
		
		return output
	})

	return data
}