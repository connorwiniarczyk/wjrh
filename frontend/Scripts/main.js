Main = {}

Main.Home = {}
Main.Details = {}

window.addEventListener("load", function(){
	const tabs_details = Utils.DomQuery(".page--programs, .page--schedule, .page--contact-us")
	Main.Details.tabs = new TabMenu(tabs_details)

	//TODO: add contact-us and about-us pages to tab menu
	HashLink.on("schedule", () => Main.Details.tabs.switchTo(0))
	HashLink.on("programs", () => Main.Details.tabs.switchTo(1))
	HashLink.on("contact-us", () => Main.Details.tabs.switchTo(2))


	const tabs_home = Utils.DomQuery(".page--home, .page--music-player")
	Main.Home.tabs = new TabMenu(tabs_home)

	HashLink.on("home", () => Main.Home.tabs.switchTo(0))
	HashLink.on("", () => Main.Home.tabs.switchTo(0))

	HashLink.on("music-player", () => Main.Home.tabs.switchTo(1))
	HashLink.on("listen", () => Main.Home.tabs.switchTo(1))

	HashLink.onHash()
})
