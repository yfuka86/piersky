import Graph from './components/graphs/team_daily_graph';

let graphElement = document.getElementById('graph_container');

if (graphElement) {
  let g = new Graph;
  g.drawChart();
}
