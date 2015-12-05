import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import changeCase from 'change-case';
import {getTicks} from '../../utils/app_module';

import UserAction from '../../actions/user';
import UserStore from '../../stores/user';
import IdentityStore from '../../stores/identity';
import IntegrationStore from '../../stores/integration';
import StatisticsStore from '../../stores/statistics';
import Loading from '../../components/common/loading';

class UserStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.HOUR_PER_DAY = 24;
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return this.getParamsFromStores(this.props);
  }

  getParamsFromStores(props) {
    let user = UserStore.getUserById(props.params.id)
    let stats = StatisticsStore.getUserStatsById(user.id);

    return {
      user: user,
      identities: IdentityStore.getIdentitiesByUserId(user.id),
      stats: stats,
      periodLength: 28
    };
  }

  componentDidMount() {
    StatisticsStore.onChange(this.onChangeHandler);
    this._loadUserStats(this.props.params.id);
    window.onresize = this.drawChart.bind(this);
    this.drawChart();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getParamsFromStores(nextProps));
    this._loadUserStats(nextProps.params.id);
  }

  componentDidUpdate() {
    this.drawChart();
  }

  componentWillUnmount() {
    StatisticsStore.offChange(this.onChangeHandler);
    window.onresize = null;
  }

  _loadUserStats(id) {
    if (!StatisticsStore.getUserStatsById(id) && !this.state.loading) {
      this.setState({loading: true}, () => {
        UserAction.stats(id).then((res) => {
          this.setState({loading: false});
        });
      });
    }
  }

  onChange(e) {
    this.setState(this.getParamsFromStores(this.props));
  }

  drawChart() {
    if(!this.state.stats || this.state.loading) return;
    let width = React.findDOMNode(this).clientWidth - 20;
    let height = parseInt(width * 3 / 8);
    let stats = this.state.stats;
    let length = this.state.periodLength;
    let max = 0;
    let table = [];
    if (length === 1) {
      let header = [I18n.t('user.stats.period.time_of_day')].concat(stats.integrations.map((i) => {return IntegrationStore.getIntegrationById(i.id).name;}));
      table.push(header);
      _.times(this.HOUR_PER_DAY, (i) => {
        let ary = stats.integrations.map((integration) => {
          return integration.day[i];
        });
        let sum = _.sum(ary);
        if (sum > max) max = sum;
        table.push([i].concat(ary));
      })
    } else {
      let end = moment(stats.today);
      let header = ['Day'].concat(stats.integrations.map((i) => {return IntegrationStore.getIntegrationById(i.id).name;}));
      table.push(header);
      _.times(length, (i) => {
        let ary = stats.integrations.map((integration) => {
          return integration.default[length - (i + 1)];
        });
        let sum = _.sum(ary);
        if (sum > max) max = sum;
        table.push([moment(end).subtract(length - (i + 1), 'days').format("MMM Do")].concat(ary));
      })
    }

    var graphData = google.visualization.arrayToDataTable(table);
    let options = {
      width: width,
      height: height
    };

    if (max > 0) {
      var chart = new google.charts.Line(React.findDOMNode(this).querySelector('#main_graph'));
      chart.draw(graphData, options);
    } else {
      React.findDOMNode(this).querySelector('#main_graph').innerHTML = `<div class="no-activities" style="height: ${height}px">${I18n.t('integration.general.no_activities')}</div>`;
    }
  }

  changePeriod(e) {
    this.setState({periodLength: parseInt(e.target.value, 10)})
  }

  render() {
    let userIdentities;
    if (false && this.state.stats) {
      userIdentities = _.sortBy(this.state.stats.identities, (identityData) => {
        return -_.sum(identityData[this.state.activity].slice(0, this.state.periodLength));
      }).map((identityData) =>{
        let identity = IdentityStore.getIdentityById(identityData.id);
        let user = IdentityStore.getUserByIdentityId(identityData.id);
        let total = _.sum(identityData[this.state.activity].slice(0, this.state.periodLength));
        let avg = Math.round(total / this.state.periodLength * 100) / 100;
        return (
          <div className={`option ${this.isExpanded(identity.id) ? 'expanded' : ''}`} key={identityData.id}>
            <div className='toggle' onClick={this.toggleExpantion.bind(this, identity.id)} />
            <div className='content-area'>
              <div className='user-info-area'>
                {user ? <UserInfo user={user} /> : <p className='main-content'>{identity.name}</p>}
              </div>

              <div className='user-select-form'>
                <UserSelect onChange={updateIdentity.bind(this, identity.id)} value={!!user ? user.id : null} />
              </div>

              <p className='main-content total'>{total}</p>
              <p className='main-content avg'>{avg}</p>
              <div className='user-graph' id={`user_graph_${identity.id}`} />
            </div>

            {this.isExpanded(identity.id) ? (
              <div className='expanded-area'>
                <div className='field'>
                </div>
                <div className='field'>
                </div>
              </div>
            ) : (<div />)}
          </div>
        );
      });
    }

    return this.state.loading ? <Loading /> :
      <div className='user-statistics'>
        <div className='graph-action standard-form-horizontal'>
          <div className='field'>
            <select onChange={this.changePeriod.bind(this)}>
              <option value={28} >{I18n.t('user.stats.period.last_month')}</option>
              <option value={7} >{I18n.t('user.stats.period.last_week')}</option>
              <option value={1} >{I18n.t('user.stats.period.time_of_day')}</option>
            </select>
          </div>
        </div>

        <div id='main_graph' />

        <div class='user-identities'>
          <p class='section-title'>Activities last 24 hour</p>
          {userIdentities}
        </div>
      </div>;
  }
}

export default UserStatistics;
