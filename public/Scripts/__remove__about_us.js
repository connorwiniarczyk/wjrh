// let ABOUT_US = {}

// function determineOverflow(content, container) {
//     var containerMetrics = container.getBoundingClientRect();
//     var containerMetricsRight = Math.floor(containerMetrics.right);
//     var containerMetricsLeft = Math.floor(containerMetrics.left);
//     var contentMetrics = content.getBoundingClientRect();
//     var contentMetricsRight = Math.floor(contentMetrics.right);
//     var contentMetricsLeft = Math.floor(contentMetrics.left);
//     if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
//         return "both";
//     } else if (contentMetricsLeft < containerMetricsLeft) {
//         return "left";
//     } else if (contentMetricsRight > containerMetricsRight) {
//         return "right";
//     } else {
//         return "none";
// //     }
// // }

// ABOUT_US.blocks; 

// window.addEventListener("load", function(){
//     const scrollWindow = document.getElementById("scroll-window");
//     const scrollContent = document.getElementById("scroll-content");
//     const navbar = document.getElementById("about-us-navbar");

//     ABOUT_US.blocks = [].slice.call(document.querySelectorAll(".block"));
//     // console.log(blocks);


//     scrollWindow.setAttribute("data-overflowing", determineOverflow(scrollContent, scrollWindow));

//     [].slice.call(document.querySelectorAll(".pn-ProductNav_Link"))
//     .forEach((element, index) => {
//         element.addEventListener("click", () => {
//             console.log(ABOUT_US.blocks)
//             ABOUT_US.scrollTo(ABOUT_US.blocks[index], scrollContent, scrollWindow)
//             moveIndicator(element, "#f90", navbar)
//         })
//     })

//     navbar.addEventListener("click", function(e){
//         let links = [].slice.call(document.querySelectorAll(".pn-ProductNav_Link"))

//         links.forEach(item => item.setAttribute("aria-selected", "false"));
//         e.target.setAttribute("aria-selected", "true");
//     })
// });

// let last_known_scroll_position = 0;
// let ticking = false;

// var SETTINGS = {
//     navBarTravelling: false,
//     navBarDirection: "",
//     navBarTravelDistance: 150
// }

// ABOUT_US.scrollTo = function(block, scrollContent, scrollWindow){
//     // const size = 4; // the number of panels
//     // const scrollAmount = -(100 / size) * index;

//     // scrollContent.style.transform = "translateX(" + scrollAmount + "%)";

//     let blockPosition = block.getBoundingClientRect();
//     let container = scrollContent.getBoundingClientRect().left;
//     let distance = blockPosition.left - container;
//    scrollContent.style.transform = "translateX(" + -distance + "px)";
// }

// function moveIndicator(item, color, navbar) {
//     let pnIndicator = document.getElementById("nav-indicator")
//     var textPosition = item.getBoundingClientRect();
//     var container = navbar.getBoundingClientRect().left;
//     console.log(textPosition, container);
//     var distance = textPosition.left - container;
//     var scrollPosition = pnIndicator.parentNode.scrollLeft;
//     pnIndicator.style.transform = "translateX(" + (distance) + "px) scaleX(" + textPosition.width * 0.01 + ")";
//     if (color) {
//         pnIndicator.style.backgroundColor = color;
//     }
// }