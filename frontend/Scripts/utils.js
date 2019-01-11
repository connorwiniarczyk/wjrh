Utils = {}

Utils.query = null;
Utils.tealQuery = async function(query) {

	// build our HTTP POST request
	const request = fetch("http://45.55.38.183:4000/graphql", {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({query: query, raw: true}),
		method: "POST"
	})

	Utils.query = request

	const result = await Utils.query.then(res => res.json())

	if(result.errors) throw result.errors[0]

	return result.data
}

Utils.escapeHtml = function(unsafe) {
    return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
 }

Utils.DomQuery = function(query){
	const nodelist = document.querySelectorAll(query)
	return Array.prototype.slice.call(nodelist)
}

Utils.CorsHack = url => `http://10.0.0.146/cors-hack?url=${url}`

Utils.ParseURLQuery = function(url) {
	const query = url.substr(1);
	let result = {};

	query.split("&").forEach(function(part) {
		let item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});

	return result;
}

const TabMenu = function(tabs) {
	this.tab_list = tabs
}

TabMenu.prototype.switchTo = function(index) {
	// remove the "active" class from all tabs in the list
	this.tab_list.forEach(tab => tab.classList.remove("active"))

	// set the desired tab to active
	this.tab_list[index].classList.add("active")
}

HashLink = {}

HashLink.listeners = {}

HashLink.on = function(event, callback){
	if(HashLink.listeners[event] === undefined) HashLink.listeners[event] = []

	HashLink.listeners[event].push(callback)
}

HashLink.exec = function(event, args){
	if(HashLink.listeners[event] === undefined) return

	HashLink.listeners[event].forEach(listener => listener(args))
}

window.addEventListener("hashchange", function(){
	if(!window.location.hash) return
	
	const hash_string = window.location.hash.substring(1)
	const hash_method = hash_string.match(/^.*?(?=(\?|$))/gi)[0]

	const hash_arg_string = hash_string.match(/\?.+?$/ig)[0]
	const hash_args = Utils.ParseURLQuery(hash_arg_string)

	HashLink.exec(hash_method, hash_args)
})

HashLink