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

// const graphData = JSON.parse(dataElem.dataset.results);
// Dummy data for now
const graphData = {
  "nodes": [{"image": 111295}, {"image": 862}, {"image": 20686}, {"image": 72951}, {"image": 119985}, {"image": 11025}, {"image": 80548}, {"image": 111428}, {"image": 15486}, {"image": 0}, {"image": 136395}, {"image": 31285}, {"image": 136190}, {"image": 40647}, {"image": 196282}, {"image": 88372}],
  "edges": [{"source": 0, "target": 40647, "distance": 12235}, {"source": 0, "target": 88372, "distance": 13208}, {"source": 0, "target": 111295, "distance": 13369}, {"source": 0, "target": 31285, "distance": 13571}, {"source": 40647, "target": 88372, "distance": 10551}, {"source": 40647, "target": 80548, "distance": 12235}, {"source": 40647, "target": 119985, "distance": 12385}, {"source": 40647, "target": 136190, "distance": 12662}, {"source": 88372, "target": 40647, "distance": 10551}, {"source": 88372, "target": 111428, "distance": 11061}, {"source": 88372, "target": 119985, "distance": 11295}, {"source": 88372, "target": 11025, "distance": 11306}, {"source": 111295, "target": 862, "distance": 10281}, {"source": 111295, "target": 136395, "distance": 10670}, {"source": 111295, "target": 72951, "distance": 10734}, {"source": 111295, "target": 196282, "distance": 10745}, {"source": 31285, "target": 20686, "distance": 11891}, {"source": 31285, "target": 88372, "distance": 12413}, {"source": 31285, "target": 15486, "distance": 12803}, {"source": 31285, "target": 40647, "distance": 12940}]
};
// console.log(graphData);
const recImage = document.getElementById('rec-image');

// D3 graph here
const width = 1490;
const height = 700;

d3.json('static/data/similart_data.json').then((metadata) => {
  graphData['nodes'] = graphData['nodes'].map(img => ({ img, ...metadata[img['image'].toString()] }));
  console.log(graphData['nodes']);

  const forceGraph = d3.forceSimulation(graphData.nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink().id(d => d.image))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2));

  forceGraph.force("link").links(graphData.edges).distance(d => d.distance / 100);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Create SVG element
  const svg = d3.select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const rectangle = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "cornsilk");

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
    .attr("height", 200)
    .attr("x", 200 + 100)
    .attr("y", height - 200);

  //Create nodes as circles
  const nodes = svg.selectAll("circle")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .style("fill", d => {
      if (d.image == 0) return "crimson";
    })
    .on("mouseover", d => {
      d3.select(this).attr("fill", "goldenrod")
      const part1 = "https://www.artic.edu/iiif/2/";
      const image_id = d["image_id"];
      const part2 = "/full/843,/0/default.jpg";
      const url = part1.concat(image_id, part2);
      nodeImage.attr("xlink:href", url);
    })
    .on("mouseout", d => d3.select(this).attr("fill", "black"));

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

// Temporary code to show modal and overlay
// showArtDetails();
