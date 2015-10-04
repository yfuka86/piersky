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
      periodEndAt: moment(this.props.stat.today)
    }
  }

  componentDidMount() {
    this.drawChart();
    window.onresize = this.drawChart.bind(this);
  }

  componentDidUpdate() {
    this.drawChart();
  }

  componentWillUnmount() {
    window.onresize = null;
  }


  drawChart() {
    if (!this.props) return;
    let channelId = this.state.channelId;
    let end = this.state.periodEndAt;
    let length = this.state.periodLength;

    let width = React.findDOMNode(this).clientWidth;
    let height = parseInt(width * 3 / 8);

    let identitiesData = this.props.stat.identities;
    identitiesData = _.reject(identitiesData, (data) => {
      return _.sum(data[channelId].slice(0, length)) === 0;
    })

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
        vAxis: {
          ticks: ticks,
          minValue: 0
        }
      };

      let chart = new google.visualization.AreaChart(React.findDOMNode(this).querySelector('#main_graph'));
      chart.draw(tableData, options);
    } else {
      React.findDOMNode(this).querySelector('#main_graph').innerHTML = `<div class="no-activities" style="height: ${height}px">${I18n.t('integration.general.no_activities')}</div>`;
    }
  }

  changeChannel(e) {
    this.setState({channelId: e.target.value});
  }

  changePeriod(e) {
    this.setState({periodLength: parseInt(e.target.value, 10)})
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
        <div id='main_graph' />
      </div>
    );
  }
}

export default Slack;
