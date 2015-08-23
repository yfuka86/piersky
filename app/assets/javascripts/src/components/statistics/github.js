import React from 'react';
import _ from 'lodash';
import request from 'superagent';
import ReactD3 from 'react-d3-components'
import Constants from '../../constants/app';
import {APIRoot} from '../../constants/app';


class Github extends React.Component {

  constructor(props){
    super(props);
    this.state= {
      json: []
    };
  }

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
        this.drawChart();
      }
    }.bind(this));
  }

    drawChart(){
      let data = google.visualization.arrayToDataTable([
        ['Repository', 'number', { role: 'style' }]
      ].concat(this.state.json.map(function(repo){
        return [repo.user + "/"+ repo.name, repo.pull_requests.length, Constants.colorHexByKey(repo.user + "/"+ repo.name)];
      })));

      let options = {
        title: 'number of open pull requests',
        chartArea: {width: 890,height: 400},
        hAxis: {
          title: 'number',
          minValue: 0
        },
        vAxis: {
          title: 'Repository'
        }
      };

      let chart = new google.visualization.BarChart(React.findDOMNode(this).querySelector('#graph_'));

      chart.draw(data, options);
    }

  render() {
    // data = [{
    //   label: 'pull_requests',
    //   values: this.state.json.filter(function(obj){
    //     return obj.pull_requests.length!=0;
    //   }).map(function(obj){
    //     return  {x: obj.user + "/" + obj.name,y: obj.pull_requests.length}
    //   })
    // }];
    return (
      <div className='statistics-github'>
        <div id='graph_' />
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
}

export default Github;
