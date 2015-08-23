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
      data: [
        {label: 'Github', values: [
          {x: new Date(2015, 2, 5), y: 1},
          {x: new Date(2015, 2, 6), y: 2},
          {x: new Date(2015, 2, 7), y: 0},
          {x: new Date(2015, 2, 8), y: 3},
          {x: new Date(2015, 2, 9), y: 2},
          {x: new Date(2015, 2, 10), y: 3},
          {x: new Date(2015, 2, 11), y: 4},
          {x: new Date(2015, 2, 12), y: 4},
          {x: new Date(2015, 2, 13), y: 1},
          {x: new Date(2015, 2, 14), y: 5},
          {x: new Date(2015, 2, 15), y: 0},
          {x: new Date(2015, 2, 16), y: 1},
          {x: new Date(2015, 2, 16), y: 1},
          {x: new Date(2015, 2, 18), y: 4},
          {x: new Date(2015, 2, 19), y: 4},
          {x: new Date(2015, 2, 20), y: 5},
          {x: new Date(2015, 2, 21), y: 5},
          {x: new Date(2015, 2, 22), y: 5},
          {x: new Date(2015, 2, 23), y: 1},
          {x: new Date(2015, 2, 24), y: 0},
          {x: new Date(2015, 2, 25), y: 1},
          {x: new Date(2015, 2, 26), y: 1}
        ]},
        {label: 'Slack', values: [
          {x: new Date(2015, 2, 5), y: 5},
          {x: new Date(2015, 2, 6), y: 6},
          {x: new Date(2015, 2, 7), y: 4.4},
          {x: new Date(2015, 2, 8), y: 3.3},
          {x: new Date(2015, 2, 9), y: 2.8},
          {x: new Date(2015, 2, 10), y: 4.2},
          {x: new Date(2015, 2, 11), y: 5.1},
          {x: new Date(2015, 2, 12), y: 4.2},
          {x: new Date(2015, 2, 13), y: 3.5},
          {x: new Date(2015, 2, 14), y: 3.6},
          {x: new Date(2015, 2, 15), y: 1.9},
          {x: new Date(2015, 2, 16), y: 3.1},
          {x: new Date(2015, 2, 16), y: 3.0},
          {x: new Date(2015, 2, 18), y: 3.0},
          {x: new Date(2015, 2, 19), y: 4.5},
          {x: new Date(2015, 2, 20), y: 5.2},
          {x: new Date(2015, 2, 21), y: 3.8},
          {x: new Date(2015, 2, 22), y: 3.7},
          {x: new Date(2015, 2, 23), y: 4.3},
          {x: new Date(2015, 2, 24), y: 3.1},
          {x: new Date(2015, 2, 25), y: 0},
          {x: new Date(2015, 2, 26), y: 1.2}
        ]},
        {label: 'Slack', values: [
          {x: new Date(2015, 2, 5), y: 1.2},
          {x: new Date(2015, 2, 6), y: 1.7},
          {x: new Date(2015, 2, 7), y: 1.4},
          {x: new Date(2015, 2, 8), y: 1.3},
          {x: new Date(2015, 2, 9), y: 1.8},
          {x: new Date(2015, 2, 10), y: 1.2},
          {x: new Date(2015, 2, 11), y: 1.1},
          {x: new Date(2015, 2, 12), y: 1.2},
          {x: new Date(2015, 2, 13), y: 1.5},
          {x: new Date(2015, 2, 14), y: 1.6},
          {x: new Date(2015, 2, 15), y: 1.9},
          {x: new Date(2015, 2, 16), y: 1.1},
          {x: new Date(2015, 2, 16), y: 1.0},
          {x: new Date(2015, 2, 18), y: 1.0},
          {x: new Date(2015, 2, 19), y: 1.5},
          {x: new Date(2015, 2, 20), y: 1.2},
          {x: new Date(2015, 2, 21), y: 1.8},
          {x: new Date(2015, 2, 22), y: 1.7},
          {x: new Date(2015, 2, 23), y: 1.3},
          {x: new Date(2015, 2, 24), y: 1.1},
          {x: new Date(2015, 2, 25), y: 0.7},
          {x: new Date(2015, 2, 26), y: 1.2}
        ]}
      ],
      xScale: d3.time.scale().domain([new Date(2015, 2, 5), new Date(2015, 2, 26)]).range([0, 890 - 70]),
      xScaleBrush: d3.time.scale().domain([new Date(2015, 2, 5), new Date(2015, 2, 26)]).range([0, 890 - 70])
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    let LineChart = ReactD3.LineChart;

    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('webapp.users.show', {name: 'yfuka86'})}</p>
        <LineChart
          data={this.state.data}
          width={890}
          height={300}
          margin={{top: 10, bottom: 50, left: 50, right: 20}}
          xScale={this.state.xScale}
          xAxis={{tickValues: this.state.xScale.ticks(d3.time.day, 2), tickFormat: d3.time.format("%m/%d")}}
          stroke={{strokeLinecap: 'round'}}
        />
      </div>
    );
  }
}

export default UsersShow;
