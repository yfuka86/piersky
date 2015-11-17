import Graph from './components/graphs/team_daily_graph';

if (google) {
  google.load("visualization", "1.1", {packages:['corechart', 'line']});
  google.setOnLoadCallback(() => {
    let graphElement = document.getElementById('graph_container');

    if (graphElement) {
      let g = new Graph;
      g.drawChart();
    }
  });
}
