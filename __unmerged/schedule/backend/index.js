const server = require('./server.js')
const schedule = require('./parser.js')


server.get('/schedule', function(req, res){
	schedule.parse()
	.then(data => res.send(data))
	.catch(err => res.send(err))
})

schedule.parse()
.catch(err => console.log(err))

server.listen(80)