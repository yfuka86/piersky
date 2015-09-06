import React from 'react';
import _ from 'lodash';
import ReactD3 from 'react-d3-components'

class UsersShow extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
    };
  }

  componentDidMount() {
    this.drawChart();
  }

  componentWillUnmount() {
  }

  drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['date', 'Slack', 'Github'],
      ['2015/08/07',  1000,      400],
      ['2015/08/08',  1170,      460],
      ['2015/08/09',  1660,       1120],
      ['2015/08/10',  1030,      540],
      ['2015/08/11',  1200,      400],
      ['2015/08/12',  117,      260],
      ['2015/08/13',  360,       100],
      ['2015/08/14',  1030,      540],
      ['2015/08/15',  900,      400],
      ['2015/08/16',  1170,      460],
      ['2015/08/17',  660,       1120],
      ['2015/08/18',  1030,      540],
      ['2015/08/19',  200,      100],
      ['2015/08/20',  370,      60],
      ['2015/08/21',  660,       1120],
      ['2015/08/22',  1000,      400],
      ['2015/08/23',  1170,      460]
    ]);

    var options = {
      title: 'activity',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph'));

    chart.draw(data, options);
  }

  render() {
    let LineChart = ReactD3.LineChart;

    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('webapp.users.show', {name: 'yfuka86'})}</p>
        <div id='graph' />
        <p className='title'>contribution score<br/>1.12<br/>rank: 2nd</p>
      </div>
    );
  }
}

export default UsersShow;
