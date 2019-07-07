const config = require('../config.json')

const server = require('./server.js')
const path = require('path')
const bodyParser = require('body-parser')
const fetch = require("node-fetch")

const schedule = require('./services/schedule/index.js')

// path to public directory
const public = path.join(__dirname, '../frontend')

server.get("/", async function(req, res){
	res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

server.get("/config", function(req, res){
	res.send(`const config = ${JSON.stringify(config)}`)
})

server.expose_dir(path.join(__dirname, "../frontend"), "/")

server.app.use("/cors-hack", async function(req, res, next){
	const request = await fetch(req.query.url)
	res.set('Content-Type', request.headers.get('Content-Type'))
	request.body.pipe(res)
})

// app.get('/', function(req, res){
// 	res.sendFile(`${public}/index.html`)
// })

// app.get('/api/schedule', async function(req, res){
// 	const data = await schedule.parse()
// 	res.send(data)
// })

server.listen(config.port || 80)

// //the module we wrote for handling api requests
// const api = require("./api/api");

// app.get('/', function(req, res){
// 	res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.get('/api/:method', function(req, res){
// 	api.call(req.params.method, req.query)
// 	.then((data) => {
// 		if(data.type == "file") 		res.sendFile(path.join(__dirname, data.content));
// 		else if(data.type == "string")	res.send(data.content);
// 		else if(data.type == "url") {
// 			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
// 			res.header('Expires', '-1');
// 			res.header('Pragma', 'no-cache');
// 			request(data.content).pipe(res);
// 		}
// 		else res.send("error: type " + data.type + " not recognized");
// 	})
// 	.catch(error => res.send("error: " + error.message));
// });

// var bodyParser = require("body-parser")
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// const teal = require("./api/teal_wrapper");

// app.post('/teal', function(req, res){
// 	// res.send("test")
// 	teal.query(req.body.query)
// 	// teal.query(`{
// 	// 	program (id: "sendnudes") {
// 	// 		name
// 	// 	}
// 	// }`)
// 	.then(response => res.send(response))
// })

// app.use('/', express.static('public'));

// // start the server on port 80 
// const server = app.listen(80, function(){
// 	if(process.send) process.send('online')
// })
// io.listen(server);

// // Manage socket connections
// io.on('connection', function(socket){
// 	// io.emit("newData", api.metadata.getData());

// });

// bacon.when([api.metadata.stream, api.colors.stream], function(metadata, colorScheme){
// 	metadata.colorScheme = colorScheme
// 	return metadata
// })
// .onValue(data => io.emit("newData", data))
// // api.metadata.onData(data => io.emit("newData", data));
