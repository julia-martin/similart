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

// const graphData = JSON.parse(dataElem.dataset.results);
// Dummy data for now
const graphData = {
  "nodes": [{"id": 111295}, {"id": 862}, {"id": 20686}, {"id": 72951}, {"id": 119985}, {"id": 11025}, {"id": 80548}, {"id": 111428}, {"id": 15486}, {"id": 0}, {"id": 136395}, {"id": 31285}, {"id": 136190}, {"id": 40647}, {"id": 196282}, {"id": 88372}],
  "edges": [{"source": 0, "target": 40647, "distance": 12235}, {"source": 0, "target": 88372, "distance": 13208}, {"source": 0, "target": 111295, "distance": 13369}, {"source": 0, "target": 31285, "distance": 13571}, {"source": 40647, "target": 88372, "distance": 10551}, {"source": 40647, "target": 80548, "distance": 12235}, {"source": 40647, "target": 119985, "distance": 12385}, {"source": 40647, "target": 136190, "distance": 12662}, {"source": 88372, "target": 40647, "distance": 10551}, {"source": 88372, "target": 111428, "distance": 11061}, {"source": 88372, "target": 119985, "distance": 11295}, {"source": 88372, "target": 11025, "distance": 11306}, {"source": 111295, "target": 862, "distance": 10281}, {"source": 111295, "target": 136395, "distance": 10670}, {"source": 111295, "target": 72951, "distance": 10734}, {"source": 111295, "target": 196282, "distance": 10745}, {"source": 31285, "target": 20686, "distance": 11891}, {"source": 31285, "target": 88372, "distance": 12413}, {"source": 31285, "target": 15486, "distance": 12803}, {"source": 31285, "target": 40647, "distance": 12940}]
};
// console.log(graphData);
const recImage = document.getElementById('rec-image');

// D3 graph here
const width = 1000;
const height = 700;

function genUrl(imageId) {
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
}

d3.json('static/data/similart_data.json').then((metadata) => {
  graphData['nodes'] = graphData['nodes'].map(img => ({ img, ...metadata[img['id'].toString()] }));
  console.log(graphData['nodes']);

  const forceGraph = d3.forceSimulation(graphData.nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink().id(d => d.id))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2));

  // forceGraph.force("link").links(graphData.edges).distance(d => d.distance / 100);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Create SVG element
  const svg = d3.select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const rectangle = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none");

  // Create edges as lines
  const edges = svg.selectAll("line")
    .data(graphData.edges)
    .enter()
    .append("line")
    .style("stroke", "teal")
    .style("stroke-width", 6);

  // Preview image when hovering on node
  const nodeImage = svg.append("svg:image")
    .attr("width", 200)
    .attr("height", 200);

  //Create nodes as circles
  const nodes = svg.selectAll("circle")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .style("fill", d => {
      if (d.id === 0) return "crimson";
    })
    .on("mouseover", function(d) {
      d3.select(this).attr("fill", "goldenrod")
      const url = genUrl(d["image_id"]);
      nodeImage.attr("xlink:href", url)
        .attr("x", d.x)
        .attr("y", d.y);
    })
    .on("mouseout", function(d) {
      d3.select(this).attr("fill", "black");
      nodeImage.attr("xlink:href", null)
    })
    .on("click", d => {
      document.getElementById('rec-image').setAttribute('src', genUrl(d['image_id']));
      document.getElementById('rec-title').textContent = d['title'];
      document.getElementById('rec-artist').textContent = `By: ${d['artist_title']}`;
      document.getElementById('rec-year').textContent = d['date_display'];
      showArtDetails();
    });

    //Applies force tick
		forceGraph.on("tick", () => {
      edges.attr("x1", d => d.source.x )
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      nodes.attr("cx", d => d.x)
          .attr("cy", d => d.y);
		});
});
// End D3

function showArtDetails() {
  overlay.style.visibility = "visible";
  modal.style.visibility = "visible";
}

overlay.addEventListener('click', () => {
  overlay.style.visibility = "hidden";
  modal.style.visibility = "hidden";
});
