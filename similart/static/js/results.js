const main = document.querySelector("main");
const loader = document.querySelector("#loader");
const dataElem = document.getElementById('data-container');
const container = document.getElementById('d3-container');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');

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

const data = JSON.parse(dataElem.dataset.results);
console.log(data);

// D3 graph here

function showArtDetails() {
  overlay.style.visibility = "visible";
  modal.style.visibility = "visible";
}

overlay.addEventListener('click', () => {
  overlay.style.visibility = "hidden";
  modal.style.visibility = "hidden";
});

// Temporary code to show modal and overlay
showArtDetails();
