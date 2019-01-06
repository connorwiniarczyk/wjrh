const server = require('./server.js')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.join(__dirname, '/schedule.yaml'), 'utf8')
const schedule = yaml.parse(file)

server.get('/schedule', function(req, res){

	res.send(schedule)
})

server.listen(80)