const event = new CustomEvent('content-loaded')

window.addEventListener("load", async function(){
	const converter = new showdown.Converter()
	converter.setOption('customizedHeaderId', true)
	const source = await fetch("content.md").then(res => res.text())

	const html = converter.makeHtml(source)

	document.querySelector(".page--about-us").innerHTML = html

	window.dispatchEvent(event)

	// Main.Details.tabs.switchTo(0)
})