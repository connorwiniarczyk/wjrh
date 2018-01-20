//returns an array of dom elements to be used as a visualizer
const createDomVisualizer = function(color){
	const elementToAppend = document.getElementById("new-visualizer");

	let elements = [];
	let template = document.getElementById("visualizer-node-template");
	template.style.background = color;

	for(var i=0;i<55;i++)
	{
		let newNode = template.cloneNode(true)
		newNode.classList.remove("template")
		elements.push(newNode);
		elementToAppend.appendChild(newNode);
	}

	return elements;

};

const averageArray = function(array, stepSize){
	let output = [];
	
	for(var i=0; i < array.length; i += stepSize) {
		output.push(array.slice(i, i + stepSize).reduce((accumulator, currentValue) => {
			return accumulator + currentValue;
		}) / stepSize);
	}

	return output;
};

const audioVisualizer = function(audio){
	this.audio = audio;
	this.ctx = new AudioContext();
	this.analyser = this.ctx.createAnalyser();
	this.analyser.fftSize = 2048;
	this.bufferLength = this.analyser.frequencyBinCount;
	this.dataArray = new Uint8Array(this.bufferLength);

	this.audio.addEventListener("canplay", function(){
		var source = this.ctx.createMediaElementSource(audio);
		source.connect(this.analyser);
		this.analyser.connect(this.ctx.destination);
	}.bind(this));
};

audioVisualizer.prototype.withDomVisualizer = function(domVisualizer){
	this.domVisualizer = domVisualizer;

	return this;
};

audioVisualizer.prototype.setColor = function(color){
	this.domVisualizer.forEach(element => element.style.background = color);
};

audioVisualizer.prototype.play = function(){
	window.requestAnimationFrame(this.draw.bind(this));
};

audioVisualizer.prototype.draw = function(){
	this.analyser.getByteFrequencyData(this.dataArray);
	this.displayArray = averageArray(this.dataArray, 15);

	this.domVisualizer.forEach((element, index) => {
		element.style.height = this.displayArray[index] + 15 + "px";
	});

	window.requestAnimationFrame(this.draw.bind(this));
};