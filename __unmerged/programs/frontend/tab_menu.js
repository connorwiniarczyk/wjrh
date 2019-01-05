const toArray = function(nodeList){
	return Array.prototype.slice.call(nodeList)
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


window.addEventListener("load", function(){
	const tab_nodes = document.querySelectorAll("section.programs > .tab")
	const tabs = toArray(tab_nodes)

	const menu = new TabMenu(tabs)

	console.log(menu)

	// menu.switchTo(1)
	// menu.switchTo(0)
})