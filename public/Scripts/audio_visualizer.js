const audioVisualizer = function(audio, canvas){
	this.audio = audio;
	this.canvas = canvas;
	this.canvasCtx = this.canvas.getContext('2d');

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
	console.log(this.analyser);
};

audioVisualizer.prototype.play = function(){
	//this.audio.play();
	window.requestAnimationFrame(this.draw.bind(this));
};

audioVisualizer.prototype.draw = function(){
	
	this.analyser.getByteFrequencyData(this.dataArray);
	this.displayArray = averageArray(this.dataArray, 15);

	this.canvasCtx.fillStyle = darkMuted;
	this.canvasCtx.fillRect(0,0,this.canvas.width, this.canvas.height);

	// this.canvasCtx.lineWidth = 2;
  	this.canvasCtx.fillStyle = lightVibrant;

  	// this.canvasCtx.beginPath();

  	var sliceWidth = this.canvas.width * 1.0 / 711;
 	var x = 0;

 	for(var i = 0; i < 711; i ++) {

        var v = this.displayArray[i] / 256;
        var y = -v * canvas.height;

        this.canvasCtx.fillRect(x, canvas.height - 10, 15 * sliceWidth, y);

        x += 15 * sliceWidth;
  	}

  	// this.canvasCtx.lineTo(this.canvas.width, this.canvas.height/2);
  	// this.canvasCtx.stroke();

	window.requestAnimationFrame(this.draw.bind(this));



	// this.analyser.getByteFrequencyData(this.dataArray);

	// this.canvasCtx.fillStyle = 'rgb(255,255,255)';
	// this.canvasCtx.fillRect(0,0,this.canvas.width, this.canvas.height);

	// this.canvasCtx.lineWidth = 2;
 //  	this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

 //  	this.canvasCtx.beginPath();

 //  	var sliceWidth = this.canvas.width * 1.0 / this.bufferLength;
 // 	var x = 0;

 // 	for(var i = 0; i < this.bufferLength; i++) {

 //        var v = this.dataArray[i] / 256;
 //        var y = (1 - v) * this.canvas.height;

 //        if(i === 0) {
 //          this.canvasCtx.moveTo(x, y);
 //        } else {
 //          this.canvasCtx.lineTo(x, y);
 //        }

 //        x += sliceWidth;
 //  	}

 //  	this.canvasCtx.lineTo(this.canvas.width, this.canvas.height/2);
 //  	this.canvasCtx.stroke();

	// window.requestAnimationFrame(this.draw.bind(this));
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