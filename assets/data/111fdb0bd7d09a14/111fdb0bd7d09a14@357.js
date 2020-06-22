// https://observablehq.com/d/111fdb0bd7d09a14@357
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["data.csv",new URL("./files/9542c09877fe7116ba7932a1bf66668c0fb0a8d166dc2d9d950e95dc28853a58bc3f9c594e6e8cb222890a3ba4986a77b40b9cd8853380b8ee5d76d26235f00f",import.meta.url)],["data@1.csv",new URL("./files/9542c09877fe7116ba7932a1bf66668c0fb0a8d166dc2d9d950e95dc28853a58bc3f9c594e6e8cb222890a3ba4986a77b40b9cd8853380b8ee5d76d26235f00f",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Scatterplot with Shapes

This chart shows the relationship between sepal width (*y*-axis) and sepal length (*x*-axis) for three species of Iris.`
)});
  main.variable(observer("legend")).define("legend", ["DOM","html","margin","color","data","shape"], function(DOM,html,margin,color,data,shape)
{
  const id = DOM.uid().id;
  return html`<style>

.${id} {
  display: flex;
  min-height: 33px;
  font: 10px sans-serif;
  margin-left: ${margin.left}px;
}

.${id}-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

</style>
<div class="${id}">${color.domain().map((name, i) => html`
  <div class="${id}-item" title="${data.labels === undefined ? "" : (data.labels[i] + "").replace(/"/g, "&quot;")}">
    <svg viewBox="-10 -10 20 20" width="20" height="20" style="margin-right: 3px;">
      <path fill="${color(name)}" d="${shape(name)}"></path>
    </svg>
    ${document.createTextNode(name)}
  </div>`)}
</div>`;
}
);
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","grid","data","x","y","color","shape"], function(d3,width,height,xAxis,yAxis,grid,data,x,y,color,shape)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .call(grid);

  svg.append("g")
      .attr("stroke-width", 1.5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("transform", d => `translate(${x(d.x)},${y(d.y)})`)
      .attr("fill", d => color(d.category))
      .attr("d", d => shape(d.category));

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
Object.assign(d3.csvParse(await FileAttachment("data@1.csv").text(), ({species: healthcare, income: x, obesity: y}) => ({healthcare, x: +x, y: +y})), {x: "Income", y: "Obesity (% Body Fat)"})
)});
  main.variable(observer()).define(["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("data.csv").text())
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(data.map(d => d.category), d3.schemeCategory10)
)});
  main.variable(observer("shape")).define("shape", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(data.map(d => d.category), d3.symbols.map(s => d3.symbol().type(s)()))
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width","data"], function(height,margin,d3,x,width,data){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(data.x))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y))
)});
  main.variable(observer("grid")).define("grid", ["x","margin","height","y","width"], function(x,margin,height,y,width){return(
g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right))
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 25, right: 20, bottom: 35, left: 40}
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
