const server = require('server')
const path = require('path')
const cors_hack = require('cors-hack')

const fetch = require("node-fetch")

const schedule = require('./services/schedule/index.js')

// Use this module to communicate with the client via websockets
const io = require("socket.io")(server.http);

server.expose_dir(path.join(__dirname, "../frontend"), "/")
server.app.use("/cors-hack", cors_hack)

server.get("/", function(req, res){
	res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

server.get("/api/schedule", async function(req, res){
	const data = await schedule.parse()
	res.send(data)
})

// fetch(`http://10.0.0.146/cors-hack?url=https://api.teal.cool/download/59e91ca73c94ae000713a88e.mp3`)

// fetch("http://10.0.0.146/cors-hack", {
// 	method: "POST",
// 	headers: {
// 		"Content-Type": "application/json"
// 	},
// 	body: `{"url": "https://api.teal.cool/download/59e91ca73c94ae000713a88e.mp3"}`
// })

server.listen(80)

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
