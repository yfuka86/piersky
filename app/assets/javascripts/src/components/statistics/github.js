import React from 'react';
import _ from 'lodash';
import request from 'superagent';
import ReactD3 from 'react-d3-components'
import {APIRoot} from '../../constants/app';

class Github extends React.Component {

  // this.props.integrationにわたってきてます

  componentDidMount() {
    this.loadStats();
  }

  componentWillUnmount() {
  }

  loadStats() {
    request
    .get(APIRoot + '/github_wrapper')
    .end(function(error, res) {
      if (res.status === 200){
        let json = JSON.parse(res.text);
        this.setState({
          json: json
        });
      }
    }.bind(this));
  }

  render() {
    let BarChart = ReactD3.BarChart;
    let data = [{
        label: 'somethingA',
        values: [{x: 'Loading', y: 5}, {x: 'data...', y: 4}, {x: '...', y: 3}]
    }];
    if (this.state){
      data = [{
        label: 'pull_requests',
        values: this.state.json.filter(function(obj){
          return obj.pull_requests.length!=0;
        }).map(function(obj){
          return  {x: obj.user + "/" + obj.name,y: obj.pull_requests.length}
        })
      }];
      return (
        <div className='statistics-github'>
          <BarChart
              data={data}
              width={400}
              height={400}
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              />
              <ul>
              {this.state.json.map(function(obj){
                console.log(obj);
                return (
                  <li id={obj.user + "/" + obj.name} className='slack-channel'>
                    <h3> {obj.user + "/" + obj.name} </h3>
                    <ul>
                    {obj.pull_requests.map(function(pl){
                      return <li> {pl.title} </li>
                    })}
                    </ul>
                  </li>
                  );
              })}
              </ul>
        </div>
      );
    }
    return (
      <div className='statistics-github'>
        <BarChart
            data={data}
            width={400}
            height={400}
            margin={{top: 10, bottom: 50, left: 50, right: 10}}
            />
      </div>
    );
  }
}

export default Github;
