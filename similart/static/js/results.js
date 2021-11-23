const main = document.querySelector("main");
const loader = document.querySelector("#loader");
const dataElem = document.getElementById("data-container");
const container = document.getElementById("d3-container");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");

const graphData = JSON.parse(dataElem.dataset.results);

// D3 settings
const WIDTH = 1000;
const HEIGHT = 600;
const NODE_DIM = 60;
const PREVIEW_DIM = 200;

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
    .force("charge", d3.forceManyBody().strength(-100))
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
      d3.forceRadial((d) => (d.id === 0 ? d.id : 300), WIDTH / 2, HEIGHT / 2)
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
    .style("stroke", "#D9F4FF")
    .style("stroke-width", 6);

  let nodeImage;
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
    .on("mouseover", function (d) {
      d3.select(this).style("fill", "#592AE6");
      if (d["image_id"]) {
        const url = genUrl(d["image_id"]);
        nodeImage = svg
          .append("svg:image")
          .attr("id", "preview-image")
          .attr("width", PREVIEW_DIM)
          .attr("height", PREVIEW_DIM)
          .attr("xlink:href", url)
          .attr("x", WIDTH - PREVIEW_DIM - 100)
          .attr("y", HEIGHT / 2);
      }
    })
    .on("mouseout", function (d) {
      d3.select(this).style("fill", (d) =>
        d.id === 0 ? "#E080D5" : "#B6BBE0"
      );
      if (nodeImage) nodeImage.remove();
    })
    .on("click", (d) => {
      if (d["image_id"]) {
        document
          .getElementById("rec-image")
          .setAttribute("src", genUrl(d["image_id"]));
        document.getElementById("rec-title").textContent = d["title"];
        document.getElementById("rec-artist").textContent = `By: ${
          d["artist_title"] || "Unknown"
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

function showArtDetails() {
  overlay.style.visibility = "visible";
  modal.style.visibility = "visible";
}

overlay.addEventListener("click", () => {
  overlay.style.visibility = "hidden";
  modal.style.visibility = "hidden";
});
