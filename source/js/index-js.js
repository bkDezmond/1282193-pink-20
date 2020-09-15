var navMain = document.querySelector(".main-nav");
var navToggle = document.querySelector(".main-nav__toggle");
var pageHeader = document.querySelector(".page-header");

navMain.classList.remove("main-nav--nojs");
pageHeader.classList.remove("page-header--nojs");
console.log("test");
navToggle.addEventListener("click", function () {
  if (navMain.classList.contains("main-nav--closed")) {
    navMain.classList.remove("main-nav--closed");
    navMain.classList.add("main-nav--opened");
    pageHeader.classList.add("page-header--opened");
  } else {
    navMain.classList.add("main-nav--closed");
    navMain.classList.remove("main-nav--opened");
    pageHeader.classList.remove("page-header--opened");
  }
});
