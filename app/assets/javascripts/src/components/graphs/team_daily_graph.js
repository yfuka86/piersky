import _ from 'lodash';
import Constants from '../../constants/app';
import {getTicks} from '../../utils/app_module';

export default class TeamDailyGraph {
  drawChart() {
    let max = 0;
    let colors = [];
    let raw = JSON.parse(document.querySelector('#graph_data').innerHTML);
    let data = _.unzip([['time'].concat(_.times(24, (n) => n))].concat(
      raw.map((obj) => {
        if (max <= _.max(obj.data)) max = _.max(obj.data);
        colors.push(Constants.colorHexByKey(obj.name));
        return [obj.name].concat(obj.data);
      })
    ));

    let width = 800;
    let height = 400;

    let tableData = google.visualization.arrayToDataTable(data);
    let ticks = getTicks(max);
    let options = {
      width: width,
      height: height,
      legend: {position: 'right', maxLines: 3},
      colors: colors,
      // curveType: 'function',
      vAxis: {
        ticks: ticks,
        minValue: 0
      }
    };

    let chart = new google.visualization.LineChart(document.querySelector('#graph'));
    google.visualization.events.addListener(chart, 'ready', () => {
      let d = document.createElement('div');
      d.id = 'graph_image_url';
      d.innerHTML = chart.getImageURI();
      document.querySelector('body').appendChild(d);
    });
    chart.draw(tableData, options);
  }
}
