Utils = {}

Utils.tealQuery = function(query) {
	return fetch("http://localhost:3000/teal", {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({query: query}),
		method: "POST"
	})
	.then(res => res.json())
	.then(body => body.data)
}