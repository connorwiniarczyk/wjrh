var express = require("express")
var app = express()
var http = require("http").Server(app)

const cors = require('cors')
app.use(cors())

var path = require("path")
var events = require("events")

exports.events = new events()
exports.on = exports.events.on.bind(exports.events)

// expose get and post requests
exports.get = app.get.bind(app)
exports.post = app.post.bind(app)

exports.listen = app.listen.bind(app)

// add support for post requests
var bodyParser = require("body-parser")
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// a default home page
app.get("/", function(req, res){
	res.sendFile( path.join(__dirname, "../frontend/index.html") );
});

// a default public directory
app.use("/", express.static(path.join(__dirname, "../frontend/")));