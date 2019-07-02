// include d3.js
const Fourier = {}

const rescaleArray = function(array, length){
	const scale = d3.scalePow()
		.exponent(2.7)
		.domain([0, length])
		.range([20, array.length - 100])

	// A discrete version of the scale function
	const scale_disc = x => Math.ceil(scale(x))


	let output = new Array(length).fill()

	return output.map((elem, index) => {
		return array
			.slice(scale_disc(index), scale_disc(index + 1))
			.reduce((prev, curr) => prev + curr, 0) 
			/ (scale_disc(index + 1) - scale_disc(index))
			// / 20
	})
}

const averageArray = (array, length) => {
	let stepsize = Math.floor(array.length / length)
	let output = new Array(length).fill()

	return output.map((element, index) => {
		return array.slice(index * stepsize, (index + 1) * stepsize)
		.reduce((prev, curr) => prev + curr) / stepsize
	})
}

Fourier.makeAnalyzer = function(audio) {
	let ctx = new AudioContext()
	let analyser = ctx.createAnalyser()
	analyser.fftSize = 1024

	//connect audio to analyser
	let source = ctx.createMediaElementSource(audio)
	source.connect(analyser)
	analyser.connect(ctx.destination)

	return analyser
}

Fourier.getSpectrumData = function(analyzer, options) {
	// optional parameter
	options = options || {}

	let output = new Uint8Array(analyzer.frequencyBinCount)
	analyzer.getByteFrequencyData(output)

	if(options.resolution) {
		output = rescaleArray(output, options.resolution)
	}

	return output
}

const Visualizer = {}

Visualizer.x_scale
Visualizer.analyzer

Visualizer.maxWidth = 1000
Visualizer.width
Visualizer.height
Visualizer.barWidth = 15

Visualizer.resolution

Visualizer.init = function({ audio, parent }){
	Visualizer.analyzer = Fourier.makeAnalyzer(audio)

	Visualizer.maxWidth = getComputedStyle(parent)["max-width"]
	Visualizer.maxWidth = parseInt(Visualizer.maxWidth.replace("px", ""))

	Visualizer.height = getComputedStyle(parent.parentElement)["height"]
	Visualizer.height = parseInt(Visualizer.height.replace("px", ""))

	// console.log(Visualizer.height / 255)

	Visualizer.onResize()

	Visualizer.x_scale = d3.scaleLinear()
		.domain([0, Visualizer.resolution])
		.range([0, Visualizer.width])
}

Visualizer.begin = function(){
	window.requestAnimationFrame(Visualizer.loop)
}

Visualizer.loop = function(){
	let data = Fourier.getSpectrumData(Visualizer.analyzer, {
		resolution: Visualizer.resolution,
	})

	Visualizer.draw(data)
	window.requestAnimationFrame(Visualizer.loop)
}

Visualizer.draw = function(data){
	const u = d3.select('.visualizer')
		.selectAll('rect')
		.data(data);

		u.enter()
		.append('rect')
		.merge(u)
		.attr("x", (height, index) => Visualizer.x_scale(index) + 1)
		.attr("y", d => (Visualizer.height) - (d * (Visualizer.height / 255) || 0) - 30)
		.attr("rx", 5)
		.attr("width", 10)
		.attr("height", d => 10 + (d * (Visualizer.height / 255) || 0))
		.style("fill", "#e6d354")
		.style("stroke", "rgb(0,0,0)")

	u.exit().remove()
}

Visualizer.onResize = function(){
	Visualizer.width = Visualizer.maxWidth ? 
		Math.min(window.innerWidth, Visualizer.maxWidth) :
		window.innerWidth

	Visualizer.resolution = Math.floor(Visualizer.width / Visualizer.barWidth)

	console.log(Visualizer.resolution)
}

window.addEventListener("resize", Visualizer.onResize)