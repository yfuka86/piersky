import React from 'react';
import _ from 'lodash';
import request from 'superagent';
import moment from 'moment';
import Constants from '../../constants/app';
import {getTicks} from '../../utils/app_module';

import IdentityStore from '../../stores/identity';
import UserStore from '../../stores/user';

class Slack extends React.Component {
  static get defaultProps() {
    return {
      integration: {},
      stat: {}
    };
  }

  static get propTypes() {
    return {
      integration: React.PropTypes.object,
      stat: React.PropTypes.object
    };
  }

  constructor(props){
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      channelId: 'default',
      periodLength: 31,
      periodEndAt: moment(this.props.stat.today),
      data: {
        messages: 0,
        avgPerDay: 0,
        users: 0,
        avgPerDayUser: 0
      }
    }
  }

  componentDidMount() {
    this.calculateSummary();
    this.drawChart();
    window.onresize = this.drawChart.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateSummary(nextProps)
  }

  componentDidUpdate() {
    this.drawChart();
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  changeChannel(e) {
    this.setState({channelId: e.target.value}, () => {
      this.calculateSummary();
    });
  }

  changePeriod(e) {
    this.setState({periodLength: parseInt(e.target.value, 10)}, () => {
      this.calculateSummary();
    })
  }

  calculateSummary(props) {
    if (!props) props = this.props;

    // set variables
    let channelId = this.state.channelId;
    let length = this.state.periodLength;

    // extract users activities
    let identitiesData = props.stat.identities;
    identitiesData = _.reject(identitiesData, (data) => {
      return _.sum(data[channelId].slice(0, length)) === 0;
    })
    let activeUserCount = identitiesData.length;

    // set summary
    let sum = _.sum(_.map(identitiesData, (data) => {
      return _.sum(data[channelId].slice(0, length));
    }));

    let calculated = {messages: sum,
                      avgPerDay: Math.round(sum / length * 100) / 100,
                      users: activeUserCount,
                      avgPerDayUser: activeUserCount === 0 ? 0 : Math.round(sum / activeUserCount / length * 100) / 100}
    this.setState({data: calculated});
  }

  drawChart() {
    if (!this.props) return;
    // set variables
    let channelId = this.state.channelId;
    let end = this.state.periodEndAt;
    let length = this.state.periodLength;

    let width = React.findDOMNode(this).clientWidth;
    let height = parseInt(width * 3 / 8);

    // extract users activities
    let identitiesData = this.props.stat.identities;
    identitiesData = _.reject(identitiesData, (data) => {
      return _.sum(data[channelId].slice(0, length)) === 0;
    })

    // render graph
    if (identitiesData.length > 0) {
      let userNames = identitiesData.map((data) => {
        return IdentityStore.getUserIdentityById(data.id)
      })
      let header = ['Day'].concat(userNames);
      let colors = userNames.map((name) => {return Constants.colorHexByKey(name)});
      let data = [header];

      let max = 0;
      _.times(length, (i) => {
        let ary = identitiesData.map((data) => {
          return data[channelId][length - (i + 1)];
        });
        let sum = _.sum(ary);
        if (sum > max) max = sum;
        data.push([moment(end).subtract(length - (i + 1), 'days').format("MMM Do")].concat(ary));
      })

      let tableData = google.visualization.arrayToDataTable(data);

      let ticks = getTicks(max);
      let options = {
        isStacked: true,
        width: width,
        height: height,
        legend: {position: 'right', maxLines: 3},
        colors: colors,
        curveType: 'function',
        vAxis: {
          ticks: ticks,
          minValue: 0
        }
      };

      let chart = new google.visualization.LineChart(React.findDOMNode(this).querySelector('#main_graph'));
      chart.draw(tableData, options);
    } else {
      React.findDOMNode(this).querySelector('#main_graph').innerHTML = `<div class="no-activities" style="height: ${height}px">${I18n.t('integration.general.no_activities')}</div>`;
    }
  }

  render() {
    return (
      <div className='statistics-slack'>
        <div className='main-graph-action standard-form-horizontal'>
          <div className='field'>
            <select onChange={this.changeChannel.bind(this)}>
              <option value={'default'} >{I18n.t('integration.slack.channel.default')}</option>
              {_.map(this.props.stat.channels, (name, id)=>{
                return <option value={id} key={id}>{name}</option>
              })}
            </select>
          </div>
          <div className='field'>
            <select onChange={this.changePeriod.bind(this)}>
              <option value={31} >{I18n.t('integration.slack.period.placeholder')}</option>
              <option value={7} >{I18n.t('integration.slack.period.last_week')}</option>
              <option value={31} >{I18n.t('integration.slack.period.last_month')}</option>
            </select>
          </div>
        </div>
        <div className='statistics-summary'>
          <div className='panel'>
            <div className='name'>{I18n.t('integration.slack.summary.messages')}</div>
            <div className='number'>{this.state.data.messages}</div>
          </div>
          <div className='panel'>
            <div className='name'>{I18n.t('integration.slack.summary.avg_per_day')}</div>
            <div className='number'>{this.state.data.avgPerDay}</div>
          </div>
          <div className='panel'>
            <div className='name'>{I18n.t('integration.slack.summary.users')}</div>
            <div className='number'>{this.state.data.users}</div>
          </div>
          <div className='panel'>
            <div className='name'>{I18n.t('integration.slack.summary.avg_per_day_users')}</div>
            <div className='number'>{this.state.data.avgPerDayUser}</div>
          </div>
        </div>
        <div id='main_graph' />
        <div className='users'>
        </div>
      </div>
    );
  }
}

export default Slack;
