const repeat = function(amount, callback){
	for(var i=0; i<amount; i++) callback(i)
}

const averageArray = (array, length) => {
	let stepsize = Math.floor(array.length / length)
	let output = new Array(length).fill()

	return output.map((element, index) => {
		return array.slice(index * stepsize, (index + 1) * stepsize)
		.reduce((prev, curr) => prev + curr) / stepsize
	})
}

const toStyle = color => "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")"

// const AudioVisualizer = function(audio) {
// 	this.analyser = makeAnalyser(audio)
// }

// AudioVisualizer.options = {
// 	loadhere: document.currentScript.getAttribute("data-loadhere") ? true : false,
// 	audioId: document.currentScript.getAttribute("data-audioId")
// }
// AudioVisualizer.parent = document.currentScript.parentElementff

const Visualizer = {}

Visualizer.elements = [];
Visualizer.color
Visualizer.analyser;

Visualizer.setColor = function(color) {
	Visualizer.color = color
	Visualizer.elements.forEach(
		element => element.style.background = toStyle(color)
	)
}

Visualizer.draw = function(data) {
	displayData = averageArray(data, Visualizer.elements.length)
	Visualizer.elements.forEach(function(element, index){ 
		element.style.height = ((displayData[index] / 255) * 100) + 5 + "%"
	})
}

Visualizer.animationLoop = function() {
	let dataArray = new Uint8Array(Visualizer.analyser.frequencyBinCount)
	Visualizer.analyser.getByteFrequencyData(dataArray)
	Visualizer.draw(dataArray)
	window.requestAnimationFrame(Visualizer.animationLoop)
}

Visualizer.render = function(container){
	container.innerHTML = "";

	let amount = Math.ceil(window.innerWidth / 20);

	let output = new Array(amount).fill().map(() => {
		let node = document.createElement("div")
		node.className = "visualizer-node"
		return node
	})

	Visualizer.elements = output;
	Visualizer.setColor(Visualizer.color || [255, 255, 255])

	output.forEach(
		element => container.appendChild(element)
	)
}

Visualizer.load = function(audio, container) {
	// initialize audio analyser
	Visualizer.analyser = makeAnalyser(audio);

	Visualizer.render(container);
	Visualizer.animationLoop()
}

const makeAnalyser = function(audio) {
	let ctx = new AudioContext()
	let analyser = ctx.createAnalyser()
	analyser.fftSize = 2048

	//connect audio to analyser
	let source = ctx.createMediaElementSource(audio)
	source.connect(analyser)
	analyser.connect(ctx.destination)

	return analyser
}

window.addEventListener("resize", () => Visualizer.render(document.getElementById("visualizer")))

// AudioVisualizer.prototype.play = function(){
// 	this.loop()
// }

// AudioVisualizer.prototype.loop = function(){
// 	let dataArray = new Uint8Array(this.analyser.frequencyBinCount)
// 	this.analyser.getByteFrequencyData(dataArray)
// 	this.draw(dataArray)
// 	window.requestAnimationFrame(this.loop.bind(this))
// }

// AudioVisualizer.prototype.stop = function(){}


// AudioVisualizer.getDraw = visualizer => data => {
// 	displayData = averageArray(data, visualizer.length)
// 	visualizer.forEach((element, index) => element.style.height = displayData[index] + "px")
// }

// AudioVisualizer.createDomVisualizer = function(color){
// 	let output = new Array(50).fill().map(() => {
// 		let node = document.createElement("div")
// 		node.className = "visualizer-node"
// 		node.style.background = color
// 		return node
// 	})

// 	return output
// }

// AudioVisualizer.setColor = function(color){
// 	this.elements.forEach(element => element.style.background = 
// 		"rgb(" + color[0] + "," + color[1] + ", " + color[2] + ")")
// }

// window.addEventListener("load", function(){
// 	let elements = AudioVisualizer.createDomVisualizer("#333")
// 	elements.forEach(element => AudioVisualizer.parent.appendChild(element))

// 	primary = new AudioVisualizer(document.getElementById(AudioVisualizer.options.audioId))
// 	primary.draw = AudioVisualizer.getDraw(elements)
// 	primary.play()

// 	primary.setColor([255, 255, 255])

// 	// colorScheme.onValue(scheme => elements.forEach(element => element.style.background = scheme.primary))
// });