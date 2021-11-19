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

// D3 settings
const width = 1000;
const height = 800;


//add legend elements
const svg_legend = d3.select("#d3-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height/10);

svg_legend.append("text")
  .text("Uploaded or Chosen Image")
  .attr("x", 50)
  .attr("y", 25);

svg_legend.append("text")
  .text("Recommended Image")
  .attr("x", 50)
  .attr("y", 55);

svg_legend.append("circle")
  .attr("cx", 20)
  .attr("cy", 20)
  .attr("r", 10)
  .attr("fill", "#E080D5")

svg_legend.append("circle")
  .attr("cx", 20)
  .attr("cy", 50)
  .attr("r", 10)
  .attr("fill", "#B6BBE0")


function genUrl(imageId) {
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
}

d3.json('static/data/similart_data.json').then((metadata) => {
  graphData['nodes'] = graphData['nodes'].map(img => ({ ...img, ...metadata[img['id'].toString()] }));
  console.log(graphData['nodes']);

  const forceGraph = d3.forceSimulation(graphData.nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink().id(d => d.id))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force("collide", d3.forceCollide(30).iterations(10))
    .force('radial', d3.forceRadial(function(d) {
      if (d.id === 0){
        return d.id
      }else{
        return 300
      }
    }, width / 2, height / 2));

  forceGraph.force("link").links(graphData.edges).distance(d => d.distance / 100);
  
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

    const labels = svg.selectAll("text")
      .data(graphData.nodes)
      .enter()
      .append("text")
      .text(function(d){
        return d.artist_title || 'Unknown';
      })
      .style("text-anchor", "middle")
      .attr("pointer-events", "none");

    // Applies force tick
		forceGraph.on("tick", () => {
      edges.attr("x1", d => d.source.x )
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      nodes.attr("cx", d => d.x)
          .attr("cy", d => d.y);

      labels.attr("x", d => d.x)
          .attr("y", d => d.y - 25);
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