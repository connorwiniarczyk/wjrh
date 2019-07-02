const express = require("express")
const app = express()
const http = require("http").Server(app)

const path = require("path")
const events = require("events")

// Disable Cross-Origin resource restrictions
const cors = require('cors')
app.use(cors())

// add support for post requests
const bodyParser = require("body-parser")

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

exports.events = new events()
exports.on = exports.events.on.bind(exports.events)
exports.app = app

exports.http = http

// expose get and post requests
exports.get = app.get.bind(app)
exports.post = app.post.bind(app)

exports.listen = app.listen.bind(app)

exports.expose_dir = function(dir, url){
	app.use(url, express.static(dir))
}