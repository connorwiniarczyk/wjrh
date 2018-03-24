function determineOverflow(content, container) {
    var containerMetrics = container.getBoundingClientRect();
    var containerMetricsRight = Math.floor(containerMetrics.right);
    var containerMetricsLeft = Math.floor(containerMetrics.left);
    var contentMetrics = content.getBoundingClientRect();
    var contentMetricsRight = Math.floor(contentMetrics.right);
    var contentMetricsLeft = Math.floor(contentMetrics.left);
    if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
        return "both";
    } else if (contentMetricsLeft < containerMetricsLeft) {
        return "left";
    } else if (contentMetricsRight > containerMetricsRight) {
        return "right";
    } else {
        return "none";
    }
}

window.addEventListener("load", function(){
    const scrollWindow = document.getElementById("scroll-window");
    const scrollContent = document.getElementById("scroll-content");
    const navbar = document.getElementById("about-us-navbar");

    scrollWindow.setAttribute("data-overflowing", determineOverflow(scrollContent, scrollWindow));

    var pnAdvancerLeft = document.getElementById("pnAdvancerLeft");
    var pnAdvancerRight = document.getElementById("pnAdvancerRight");

    pnAdvancerRight.addEventListener("click", function(){
        scrollContent.style.transform = "translateX(" + -50 + "%)";
    });

    navbar.addEventListener("click", function(e){
        let links = [].slice.call(document.querySelectorAll(".pn-ProductNav_Link"))

        links.forEach(item => item.setAttribute("aria-selected", "false"));
        e.target.setAttribute("aria-selected", "true");
    })
});

let last_known_scroll_position = 0;
let ticking = false;

var SETTINGS = {
    navBarTravelling: false,
    navBarDirection: "",
    navBarTravelDistance: 150
}