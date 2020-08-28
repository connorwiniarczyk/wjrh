const SlideShow = function(images){
	this.index = 0
	this.images = images

	this.show(0)
}

SlideShow.prototype.show = function(index){
	this.images.forEach(function(img){
		img.classList.remove('active')
	})

	this.images[index].classList.add('active')
	this.index = index
}

SlideShow.prototype.next = function(){
	const next_index = (this.index + 1) % this.images.length
	this.show(next_index)
}

// SlideShow.prototype.begin = function(duration){
//   setTimeout()
// }

window.addEventListener('content-loaded', function(){
	const slides = new SlideShow(document.querySelectorAll('.slideshow--team img'))
	document.querySelector(".slideshow").addEventListener('click', () => slides.next())
})