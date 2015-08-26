import React from 'react';
import _ from 'lodash';
import request from 'superagent';
import Constants from '../../constants/app';
import {APIRoot} from '../../constants/app';

class Slack extends React.Component {

  constructor(props){
    super(props);
    this.state= {
      channels: []
    };
  }

  componentDidMount() {
    this.loadStats();
  }

  componentWillUnmount() {
  }

  loadStats() {
      let integ_id = this.props.integration.id;
      request
      .get(APIRoot + '/slack_wrapper/' + integ_id)
      .end(function(error, res) {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          console.log("java");
          let channels = _.map(json.channels, function(channel) {
            channel.messages = [];
            request
              .get(APIRoot + '/slack_wrapper/' + integ_id + '/show/' + channel.id)
              .end(function(error, res){
                if(res.status == 200) {
                  channel.messages = JSON.parse(res.text).messages;
                  this.setState(this.state);
                  this.drawChart();
                } else {
                  reject();
                }

              }.bind(this)
              );
            return channel;
          }.bind(this));
          this.setState({
            channels: json.channels
          });
          this.drawChart();
        } else {
          reject();
        }
      }.bind(this));
  }

  drawChart(){
    let data = google.visualization.arrayToDataTable([
      ['Channel', 'number', { role: 'style' }]
    ].concat(this.state.channels.map(function(channel){
      return [channel.name, channel.messages.length, Constants.colorHexByKey(channel.name)];
    })));

    let options = {
      title: 'number of messages of channels',
      chartArea: {width: '890px'},
      hAxis: {
        title: 'number',
        minValue: 0
      },
      vAxis: {
        title: 'Channel'
      }
    };

    let chart = new google.visualization.BarChart(React.findDOMNode(this).querySelector('#graph'));

    chart.draw(data, options);

    let messages = _.reduce(this.state.channels, function(memo, channel){return memo.concat(channel.messages)}, []);
    let group = _.groupBy(messages, 'user_id');
    let ary = _.map(group, function(v,k) {return [k, v.length, Constants.colorHexByKey(k)]});

    let data2 = google.visualization.arrayToDataTable([
      ['User', 'number', { role: 'style' }]
    ].concat(ary));

    let options2 = {
      title: 'number of messages of each user',
      chartArea: {width: '890px'},
      hAxis: {
        title: 'number',
        minValue: 0
      },
      vAxis: {
        title: 'Channel'
      }
    };

    let chart2 = new google.visualization.BarChart(React.findDOMNode(this).querySelector('#graph2'));

    chart2.draw(data2, options2);
  }

  render() {
    return (
      <div className='statistics-slack'>
        <div id='graph' />
        <div id='graph2' />
        <div className='slack-channels-container'>
        <h2> Channels </h2>
        <ul>
        {this.state.channels.map(function(channel){
          console.log(channel);
          return (
            <li id={channel.id} className='slack-channel'>
              <h3> {channel.name} </h3>
              <ul>
              {channel.messages.map(function(message){
                return <li> {message.message} </li>
              })}
              </ul>
            </li>
            );
        })}
        </ul>
        </div>
      </div>
    );
  }
}

export default Slack;
