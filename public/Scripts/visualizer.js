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



const AudioVisualizer = function(audio) {
	this.analyser = makeAnalyser(audio)
}

AudioVisualizer.options = {
	loadhere: document.currentScript.getAttribute("data-loadhere") ? true : false,
	audioId: document.currentScript.getAttribute("data-audioId")
}
AudioVisualizer.parent = document.currentScript.parentElement

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

AudioVisualizer.prototype.play = function(){
	this.loop()
}

AudioVisualizer.prototype.loop = function(){
	let dataArray = new Uint8Array(this.analyser.frequencyBinCount)
	this.analyser.getByteFrequencyData(dataArray)
	this.draw(dataArray)
	window.requestAnimationFrame(this.loop.bind(this))
}

AudioVisualizer.prototype.stop = function(){}


AudioVisualizer.getDraw = visualizer => data => {
	displayData = averageArray(data, visualizer.length)
	visualizer.forEach((element, index) => element.style.height = displayData[index] + 15 + "px")
}

AudioVisualizer.createDomVisualizer = function(color){
	let output = new Array(50).fill().map(() => {
		let node = document.createElement("div")
		node.className = "visualizer-node"
		node.style.background = color
		return node
	})

	return output
}

window.addEventListener("load", function(){
	let elements = AudioVisualizer.createDomVisualizer("#333")
	elements.forEach(element => AudioVisualizer.parent.appendChild(element))

	primary = new AudioVisualizer(document.getElementById(AudioVisualizer.options.audioId))
	primary.draw = AudioVisualizer.getDraw(elements)
	primary.play()

	colorScheme.onValue(scheme => elements.forEach(element => element.style.background = scheme.primary))
});