Programs = {}

const programs_query = `
query{
	programs{
		shortname
		author
		image
		name
	}
}
`

async function render_program_list(){
	const result = await send_graphql_query('http://api.wjrh.org', programs_query, {})
	const programs = result.programs
	const target = document.querySelector(".program-list")

	programs.forEach(function(program){
		newElement = clone_template("#template--program-link", {
			...program,
			image: program.image || '/photos/default_program.png',
		})	
		target.appendChild(newElement)
	})
}

window.addEventListener("load", render_program_list)

const program_query = `
query($shortname: String){
	program(shortname:$shortname){
		shortname
		author
		image
		name
		description
		episodes {
			id
			name
			description
			audio_url	
		}
	}
}`

async function render_program_details(shortname){
	const program_page = document.querySelector('.program-details')
	const result = await send_graphql_query(
		'http://api.wjrh.org',
		program_query,
		{shortname: shortname}
	)

	const program = result.program
	console.log(shortname)

	console.log(program)

	newElement = clone_template("#template--program", {
		...program
	})

	program_page.innerHTML = ""
	program_page.appendChild(newElement)

	episode_list = document.querySelector('.program-episodes')
	episode_list.innerHTML = ""
	program.episodes.forEach(function(episode){
		newEpisodeLink = clone_template("#template--episode",{
			...episode	
		})
		episode_list.appendChild(newEpisodeLink)
	})
}

window.addEventListener("load", function(){
	const tabs = Utils.DomQuery(".page--programs > .tab")
	Programs.tabs = new TabMenu(tabs)
	Programs.switchTo = Programs.tabs.switchTo.bind(Programs.tabs)
})

window.addEventListener("load", function(){
	const searchbar = document.getElementById("program-search")

	if(!searchbar) return

	searchbar.onkeydown = function(){
		const param = searchbar.value
		Programs.LoadPrograms(param)
	}
})

HashLink.on("programs", function(args){
	if(!args.search) args.search = ""

	if(args.shortname) {
		render_program_details(args.shortname)
		Programs.switchTo(1)
	} else {
		render_program_list()
		Programs.switchTo(0)
	}
})
