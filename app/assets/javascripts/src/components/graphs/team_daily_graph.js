import _ from 'lodash';
import Constants from '../../constants/app';
import {getTicks} from '../../utils/app_module';
import Chart from 'chart.js';

export default class TeamDailyGraph {
  drawChart() {
    let raw = JSON.parse(document.querySelector('#graph_data').innerHTML);
    let dataSets =
      raw.map((obj) => {
        return {
          label: obj.name,
          fillColor: "rgba(255,255,255,0)",
          strokeColor: Constants.colorHexByKey(obj.name),
          pointColor: Constants.colorHexByKey(obj.name),
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: Constants.colorHexByKey(obj.name),
          data: obj.data
        }
      });

    var data = {
      labels: _.times(24, (n) => n),
      datasets: dataSets
    };

    let options = {
    };

    let ctx = document.getElementById("graph").getContext("2d");

    Chart.defaults.global.onAnimationComplete = () => {
      document.getElementById('graph_depicted').innerHTML = 'true';
    }

    let lineChart = new Chart(ctx).Line(data, options);
    document.getElementById('graph_legends').innerHTML = lineChart.generateLegend();
  }
}
