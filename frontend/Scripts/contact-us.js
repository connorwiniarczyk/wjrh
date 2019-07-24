ContactUs = {}

window.addEventListener("load", async function(){
	const converter = new showdown.Converter()
	converter.setOption('customizedHeaderId', true)
	const source = await fetch("content/contact_us.md").then(res => res.text())

	const html = converter.makeHtml(source)

	document.querySelector(".contact-us__content").innerHTML = html
})