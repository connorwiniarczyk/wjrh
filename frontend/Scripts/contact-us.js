ContactUs = {}

window.addEventListener("load", async function(){
	const converter = new showdown.Converter()
	converter.setOption('customizedHeaderId', true)
	const source = await fetch("content/contact_us.md").then(res => res.text())

	const html = converter.makeHtml(source)

	document.querySelector(".contact-us__content").innerHTML = html
})

window.addEventListener("load", function(){
	const submit_btn = document.querySelector(".contact-us__submit")

	const name = document.querySelector(".field--name")
	const email = document.querySelector(".field--email")
	const message = document.querySelector(".field--message")

	submit_btn.onclick = async function(){
		const data = {
			name: name.value,
			email: email.value,
			subject: "Contact Form",
			body: message.value,
		}

		const url = "http://beta.wjrh.org:3002/email"

		// const url =  Utils.CorsHack("http://45.55.38.183:3002/email")
		// console.log(url)

		const request = fetch(url, {
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			method: "POST"
		})

		const result = await request.then(res => res.text())

		console.log(result)
	}
})