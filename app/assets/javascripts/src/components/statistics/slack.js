import React from 'react';
import _ from 'lodash';
import request from 'superagent';
import ReactD3 from 'react-d3-components'
import {APIRoot} from '../../constants/app';

class Slack extends React.Component {

  // this.props.integrationにわたってきてます

  componentDidMount() {
    this.loadStats();
  }

  componentWillUnmount() {
  }

  loadStats() {
    return new Promise((resolve, reject) => {
      request
      .get(APIRoot + '/slack_wrapper')
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          this.setState({
            json: json
          });
        } else {
          reject();
        }
      })
    });
  }

  render() {
    let BarChart = ReactD3.BarChart;

    let data = [{
        label: 'somethingA',
        values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
    }];

    return (
      <div className='statistics-slack'>
        <BarChart
            data={data}
            width={400}
            height={400}
            margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
      </div>
    );
  }
}

export default Slack;
