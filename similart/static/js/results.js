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
    loader.style.display = "none";
    main.style.visibility = "visible";
  }
};

const graphData = JSON.parse(dataElem.dataset.results);
console.log(graphData);
console.log('hi')

// D3 settings
const width = 1000;
const height = 800;

function genUrl(imageId) {
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
}

d3.json('static/data/similart_data.json').then((metadata) => {
  graphData['nodes'] = graphData['nodes'].map(img => ({ ...img, ...metadata[img['id'].toString()] }));
  console.log(graphData['nodes']);

  const forceGraph = d3.forceSimulation(graphData.nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink().id(d => d.id))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2));

  forceGraph.force("link").links(graphData.edges).distance(d => d.distance / 100);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Create SVG element
  const svg = d3.select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create edges as lines
  const edges = svg.selectAll("line")
    .data(graphData.edges)
    .enter()
    .append("line")
    .style("stroke", "#D9F4FF")
    .style("stroke-width", 6);

  let nodeImage;

  // Create nodes as circles
  const nodes = svg.selectAll("circle")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .style("fill", d => d.id === 0 ? "#E080D5" : "#B6BBE0")
    .on("mouseover", function(d) {
      d3.select(this).style("fill", "#592AE6");
      if (d['image_id']) {
        const url = genUrl(d['image_id']);
        nodeImage = svg.append("svg:image")
          .attr("id", "preview-image")
          .attr("width", 200)
          .attr("height", 200)
          .attr("xlink:href", url)
          .attr("x", d.x)
          .attr("y", d.y);
      }
    })
    .on("mouseout", function(d) {
      d3.select(this).style("fill", d => d.id === 0 ? "#E080D5" : "#B6BBE0")
      nodeImage.remove();
    })
    .on("click", d => {
      document.getElementById('rec-image').setAttribute('src', genUrl(d['image_id']));
      document.getElementById('rec-title').textContent = d['title'];
      document.getElementById('rec-artist').textContent = `By: ${d['artist_title'] || 'Unknown'}`;
      document.getElementById('rec-year').textContent = d['date_display'];
      showArtDetails();
    });

    
    // Applies force tick
		forceGraph.on("tick", () => {
      edges.attr("x1", d => d.source.x )
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      nodes.attr("cx", d => d.x)
          .attr("cy", d => d.y);
		});
});

function showArtDetails() {
  overlay.style.visibility = "visible";
  modal.style.visibility = "visible";
}

overlay.addEventListener('click', () => {
  overlay.style.visibility = "hidden";
  modal.style.visibility = "hidden";
});
