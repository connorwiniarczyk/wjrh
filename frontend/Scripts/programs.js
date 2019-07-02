Programs = {}

Programs.LoadPrograms = async function(search_param){

	const query = `{
		programs (
			search_param: "${search_param || ""}",
			limit_to: 60,
			deep: false,
		){
			name,
			author,
			image,
			description,
			shortname
		}
	}`

	const data = await Utils.tealQuery(query)
	const links = data.programs.map(program => DomTemplate["program-link"](program))

	const appendTarget = document.getElementById("programs-list")
	appendTarget.innerHTML = ""
	links.forEach(link => appendTarget.appendChild(link))
}

Programs.LoadProgram = async function(shortname){

	const query = `{
		program(shortname: "${shortname}"){
			shortname,
			name,
			author,
			image,
			description,
			episodes {
				id,
				name,
				description,
				audio_url
			}
		}
	}`

	const { program } = await Utils.tealQuery(query)
	const { episodes, ...details } = program

	const details_fragment = DomTemplate["program-details"](details)
	const details_target = document.querySelector(".program-details")

	details_target.innerHTML = ""
	details_target.appendChild(details_fragment)

	const episode_links = episodes.map(episode =>
		DomTemplate["episode-link"]({episode, program: details})
	)

	episodes_target = document.getElementById("program-episodes")
	episodes_target.innerHTML = ""
	episode_links.forEach(link => episodes_target.appendChild(link))

	Programs.switchTo(1)
}

window.addEventListener("load", () => Programs.LoadPrograms())
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
