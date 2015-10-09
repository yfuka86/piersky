import React from 'react';
import _ from 'lodash';
import request from 'superagent';
import moment from 'moment';
import Constants from '../../constants/app';
import {getTicks} from '../../utils/app_module';

import IdentityStore from '../../stores/identity';
import UserStore from '../../stores/user';
import UserInfo from '../../components/users/user_info';

class Slack extends React.Component {
  static get defaultProps() {
    return {
      integration: {},
      stats: {}
    };
  }

  static get propTypes() {
    return {
      integration: React.PropTypes.object,
      stats: React.PropTypes.object
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
      expandedId: null,
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
    this.drawCharts();
    window.onresize = this.drawCharts.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateSummary(nextProps)
  }

  componentDidUpdate() {
    this.drawCharts();
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

  toggleExpantion(id) {
    if (this.isExpanded(id)) {
      this.setState({expandedId: null});
    } else {
      this.setState({expandedId: id});
    }
  }

  isExpanded(id) {
    return this.state.expandedId === id;
  }

  calculateSummary(props) {
    if (!props) props = this.props;

    // set variables
    let channelId = this.state.channelId;
    let length = this.state.periodLength;

    // extract users activities
    let identitiesData = props.stats.identities;
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

  drawCharts() {
    this.drawMainChart();
    this.drawUsersChart();
  }

  drawMainChart() {
    if (!this.props) return;
    // set variables
    let channelId = this.state.channelId;
    let end = moment(this.props.stats.today);
    let length = this.state.periodLength;

    let width = React.findDOMNode(this).clientWidth;
    let height = parseInt(width * 3 / 8);

    // extract users activities
    let identitiesData = this.props.stats.identities;
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

      let chart = new google.visualization.LineChart(React.findDOMNode(this).querySelector('#main_graph'));
      chart.draw(tableData, options);
    } else {
      React.findDOMNode(this).querySelector('#main_graph').innerHTML = `<div class="no-activities" style="height: ${height}px">${I18n.t('integration.general.no_activities')}</div>`;
    }
  }

  drawUsersChart() {
    _.each(this.props.stats.identities, (identity) => {this.drawUserChart(identity.id)});
  }

  drawUserChart(identityId) {
    if (!this.props) return;
    // set variables
    let channelId = this.state.channelId;
    let end = moment(this.props.stats.today);
    let length = this.state.periodLength;

    let width = 360;
    let height = 54;

    // extract users activities
    let identityData = _.find(this.props.stats.identities, (identityData) => {return identityData.id === identityId});


    let userName = IdentityStore.getUserIdentityById(identityId);
    let header = ['Day', userName];
    let colors = [Constants.colorHexByKey(userName)];
    let data = [header];

    _.times(length, (i) => {
      let count = identityData[channelId][length - (i + 1)];
      data.push([moment(end).subtract(length - (i + 1), 'days').format("MMM Do"), count]);
    })

    let tableData = google.visualization.arrayToDataTable(data);

    let options = {
      isStacked: true,
      width: width,
      height: height,
      legend: {position: 'none'},
      colors: colors,
      // curveType: 'function',
      vAxis: {
        ticks: [],
        minValue: 0
      }
    };

    let chart = new google.visualization.LineChart(React.findDOMNode(this).querySelector(`#user_graph_${identityId}`));
    chart.draw(tableData, options);
  }

  render() {
    return (
      <div className='statistics-slack'>
        <div className='main-graph-action standard-form-horizontal'>
          <div className='field'>
            <select onChange={this.changeChannel.bind(this)}>
              <option value={'default'} >{I18n.t('integration.slack.channel.default')}</option>
              {_.map(this.props.stats.channels, (name, id)=>{
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

        <div className='users-stats'>
          <div className='option-header'>
            <div className='content-area'>
              <p className='main-content'>{I18n.t('integration.general.member')}</p>
              <span className='right-content'>
                <p className='main-content total'>{I18n.t('integration.general.total')}</p>
                <p className='main-content avg'>{I18n.t('integration.general.per_day')}</p>
                <div className='user-graph' />
              </span>
            </div>
          </div>

          {this.props.stats.identities.map((identityData) =>{
            let identity = IdentityStore.getIdentityById(identityData.id);
            let user = IdentityStore.getUserByIdentityId(identityData.id);
            let total = _.sum(identityData[this.state.channelId].slice(0, this.state.periodLength));
            let avg = Math.round(total / this.state.periodLength * 100) / 100;
            return (
              <div className={`option ${this.isExpanded(identity.id) ? 'expanded' : ''}`}>
                <div className='toggle' onClick={this.toggleExpantion.bind(this, identity.id)} />
                <div className='content-area'>
                  {user ? <UserInfo user={user} /> : <p className='main-content'>{identity.name}</p>}

                  <span className='right-content'>
                    <p className='main-content total'>{total}</p>
                    <p className='main-content avg'>{avg}</p>
                    <div className='user-graph' id={`user_graph_${identity.id}`} />
                  </span>
                </div>

                {this.isExpanded(identity.id) ? (
                  <div className='expanded-area invitation-actions'>
                    <div className='field'>

                    </div>
                    <div className='field'>

                    </div>
                  </div>
                ) : (<div />)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Slack;
