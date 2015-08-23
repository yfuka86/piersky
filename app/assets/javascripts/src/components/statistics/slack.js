import React from 'react';
import _ from 'lodash';
import request from 'superagent';
import ReactD3 from 'react-d3-components'
import {APIRoot} from '../../constants/app';

class Slack extends React.Component {

  // this.props.integrationにわたってきてます

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
        } else {
          reject();
        }
      }.bind(this));
  }

  render() {
    let BarChart = ReactD3.BarChart;

    let data = [{
        label: 'somethingA',
        values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
    }];

    console.log(this);

    return (
      <div className='statistics-slack'>
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
