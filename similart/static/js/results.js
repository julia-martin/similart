const main = document.querySelector("main");
const loader = document.querySelector("#loader");
const dataElem = document.getElementById("data-container");
const container = document.getElementById("d3-container");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const closeModalBtn = document.getElementById("close-modal-btn");

const graphData = JSON.parse(dataElem.dataset.results);

// D3 settings
const WIDTH = 1200;
const HEIGHT = 1000;
const NODE_DIM = 60;

function genUrl(imageId) {
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
}

d3.json("static/data/similart_data.json").then((metadata) => {
  graphData["nodes"] = graphData["nodes"].map((img) => ({
    ...img,
    ...metadata[img["id"].toString()],
  }));

  const forceGraph = d3
    .forceSimulation(graphData.nodes)
    .force("charge", d3.forceManyBody().strength(-10))
    .force(
      "link",
      d3.forceLink().id((d) => d.id)
    )
    .force(
      "center",
      d3
        .forceCenter()
        .x(WIDTH / 2)
        .y(HEIGHT / 2)
    )
    .force("collide", d3.forceCollide(NODE_DIM).iterations(5))
    .force(
      "radial",
      d3.forceRadial((d) => (d.id === 0 ? d.id : 50), WIDTH / 2, HEIGHT / 2)
    );

  forceGraph.force("link").links(graphData.edges);

  // Create SVG element
  const svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  // Create edges as lines
  const edges = svg
    .selectAll("line")
    .data(graphData.edges)
    .enter()
    .append("line")
    .style("stroke", "#6366f1")
    .style("stroke-width", 6);

  // Create nodes as images
  const nodes = svg
    .selectAll(".nodes")
    .data(graphData.nodes)
    .enter()
    .append("image")
    .attr("width", NODE_DIM)
    .attr("height", NODE_DIM)
    .attr("xlink:href", function (d) {
      if (d.id === 0) {
        return null;
      } else return genUrl(d["image_id"]);
    })
    .on("click", (d) => {
      if (d["image_id"]) {
        document
          .getElementById("rec-image")
          .setAttribute("src", genUrl(d["image_id"]));
        document.getElementById("rec-title").textContent = d["title"];
        document.getElementById("rec-artist").textContent = `By: ${d["artist_title"] || "Unknown"
          }`;
        document.getElementById("rec-year").textContent = d["date_display"];
        showArtDetails();
      }
    });

  // Applies force tick
  forceGraph.on("tick", () => {
    edges
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    nodes
      .attr(
        "x",
        (d) =>
          Math.max(NODE_DIM, Math.min(WIDTH - NODE_DIM, d.x)) - NODE_DIM / 2
      )
      .attr(
        "y",
        (d) =>
          Math.max(NODE_DIM, Math.min(HEIGHT - NODE_DIM, d.y)) - NODE_DIM / 2
      );
  });
});

function getPrefersReducedMotion() {
  const mediaQueryList = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
  );
  const prefersReducedMotion = !mediaQueryList.matches;
  return prefersReducedMotion;
}

function showArtDetails() {
  overlay.style.visibility = "visible";
  modal.style.transform = "translateY(0)";

  if (!getPrefersReducedMotion()) {
    overlay.style.animation = "fadeIn 500ms linear forwards";
  } else {
    overlay.style.opacity = "100%";
  }
}

function closeModal() {
  modal.style.transform = "translateY(100%)";
  overlay.style.visibility = "hidden";

  if (!getPrefersReducedMotion()) {
    overlay.style.animation = "fadeOut 500ms linear forwards";
  } else {
    overlay.style.opacity = "0%";
  }
}

overlay.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
