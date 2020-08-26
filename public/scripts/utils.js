Utils = {}

async function send_graphql_query(url, query, params){
	const headers = {
		"Content-Type": "application/json"
	}
	const body = {
		query: query,
		variables: params,
		raw: true,
	}
	const request = window.fetch(url, {
		method: "post",
		body: JSON.stringify(body),
		headers: headers,
	})

	const result = await request
		.then(res => res.json())
		.catch(err => console.log(err))
	
	return result.data
}

function form_to_json(form){
	const elements = form.elements
	return [].reduce.call(elements, function(data, element){
		const {name, type, value} = element
		// if the name has a length of zero, treat it like
		// it doesn not exist
		if(name.length == 0) return data

		if(type == "text") data[name] = value
		if(type == "number") data[name] = parseInt(value)
				
		return data

	}, {})
}

// clones a template element, populates fields
// with data from a data object, (using handlebars notation)
// ie. {{...}} and returns the new node
function clone_template(template, data){
	// if template is a query string instead of an Element,
	// convert it to an element by querying the DOM for that
	// string
	if (typeof template === 'string'){
		template = document.querySelector(template)
	}

	const template_string = template.innerHTML
	// look for all strings enclosed by {{ }} 
	const regex = /{{(.*?)}}/gm	
	const matches = [...template_string.matchAll(regex)]
	
	let new_string = template_string
	matches.forEach(function([string, name]){
		new_string = new_string.replace(string, data[name])	
	})
	
	const newElement = document.createElement('template')
	newElement.innerHTML = new_string.trim()
	return newElement.content.firstChild
}

function get_template_variables(template){
	const template_string = template.innerHTML
	const regex = /{{(.+?)}}/gm
	const matches = [...template_string.matchAll(regex)]
	return matches.map(([text, name]) => name)
}

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

Utils.CorsHack = url => `http://${config.origin}:${config.port}/cors-hack?url=${url}`

Utils.ParseURLQuery = function(url) {
	const query = url.substr(1);
	let result = {};

	query.split("&").forEach(function(part) {
		let item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});

	return result;
}

const Decorator = function(operator){
	this.decorate = operator
}

Decorator.prototype.applyTo = function(target){
	return this.decorate(target)
}

Utils.logger = new Decorator(function(target){
	return function(){
		const result = target()
		console.log("logged")
		return result
	}
})

// Utils.Decorators["update_controls_appearance"] = function(target){
// 	return function(){ 
// 		const value = target()
// 		Player.Controls.update_appearance()
// 		return value
// 	}
// }

const TabMenu = function(tabs) {
	this.tab_list = tabs
}

TabMenu.prototype.switchTo = function(index, scrollTo = true) {
	// remove the "active" class from all tabs in the list
	this.tab_list.forEach(tab => tab.classList.remove("active"))

	// set the desired tab to active
	this.tab_list[index].classList.add("active")

	if(scrollTo) this.tab_list[index].scrollIntoView(true)
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

HashLink.onHash = function() {
	if(!window.location.hash) return
	
	const hash_string = window.location.hash.substring(1)
	const hash_method_match = hash_string.match(/^.*?(?=(\?|$))/gi)

	if(hash_method_match == null) throw "error: link invalid"
	const hash_method = hash_method_match[0]

	const hash_arg_match = hash_string.match(/\?.+?$/ig)
	const hash_arg_string = hash_arg_match ? hash_arg_match[0] : ""
	const hash_args = Utils.ParseURLQuery(hash_arg_string)

	HashLink.exec(hash_method, hash_args)
}

window.addEventListener("hashchange", HashLink.onHash)
