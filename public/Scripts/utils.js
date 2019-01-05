Utils = {}

Utils.tealQuery = async function(query) {

	// build our HTTP POST request
	const request = fetch("http://10.0.0.146:4000/graphql", {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({query: query, raw: true}),
		method: "POST"
	})
	
	const result = await request.then(res => res.json())

	if(result.errors) throw result.errors[0]

	return result.data
}