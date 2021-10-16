const main = document.querySelector("main");
const loader = document.querySelector("#loader");
const container = document.getElementById('d3-container');

document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
    main.style.visibility = "hidden";
    loader.style.display = "block";
  } else {
    setTimeout(() => {
      loader.style.display = "none";
      main.style.visibility = "visible";
    }, 2000);
  }
};
