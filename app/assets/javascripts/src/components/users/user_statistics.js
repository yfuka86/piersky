import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import changeCase from 'change-case';
import {getTicks} from '../../utils/app_module';

import UserStore from '../../stores/user';
import IdentityStore from '../../stores/identity';
import StatisticsStore from '../../stores/statistics';
import IntegrationStore from '../../stores/integration';
import IntegrationAction from '../../actions/integration';
import Loading from '../../components/common/loading';

class UserStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    let state = this.getParamsFromStores(this.props);
    state.periodLength = 31;
    state.ready = false;
    return state;
    //state.periodEndAt = moment(this.props.stat.today)
  }

  getParamsFromStores(props) {
    let user = UserStore.getUserById(props.params.id)

    return {
      user: user,
      identities: IdentityStore.getIdentitiesByUserId(user.id),
      integrations: IntegrationStore.getIntegrations(),
      statistics: StatisticsStore.getStats(),
    };
  }

  onIntegrationChange() {
    let integrations = IntegrationStore.getIntegrations();
    this.setState({ integrations: integrations });
    let p = integrations.filter((integ) => {
      return StatisticsStore.getStatsById(integ.id)==null;
    }).map((integ) => {
      return IntegrationAction.stats(integ.id);
    });
    if(p.length > 0){
      this.setState({ ready: false });
    } else {
      this.setState({ ready: true });
    }
  }

  onStatisticsChange() {
    let statistics = StatisticsStore.getStats();
    let today = _.find(statistics, (s) => true).today;
    this.setState({
      statistics: statistics,
      periodEndAt: moment(today)
    });
    if(_.size(statistics) >= this.state.integrations.length) {
      this.setState({ ready: true });
      this.drawChart();
    }
  }

  componentDidMount() {
    IntegrationStore.onChange(this.onIntegrationChange.bind(this));
    StatisticsStore.onChange(this.onStatisticsChange.bind(this));

    IntegrationAction.load();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getParamsFromStores(nextProps))
  }

  componentWillUnmount() {
  }

  onChange(e) {
    this.setState(this.getParamsFromStores(this.props));
    this.drawChart();
  }

  drawChart() {
    if(!this.state.ready) return;
    let width = React.findDOMNode(this).clientWidth;
    let height = parseInt(width * 3 / 8);

    let data = this.state.data;

    let identities = this.state.identities;
    let integrations = _.groupBy(this.state.integrations, (integration) => {
      return integration.type;
    });
    let statistics = this.state.statistics;

    var table =[['Date'].concat(_.map(integrations,(_,key) => key))];
    let length = this.state.periodLength;
    let end = this.state.periodEndAt;
    _.times(length, (i) =>{
      let ary = _.map(integrations,(group, key) => {
        let identity = _.find(identities,{ 'type': key })
        return _.reduce(group, (total, integration) => {
          let stat = statistics[integration.id];
          let tar = _.find(stat.identities, { 'id': identity.id });
          if(tar) return total + tar.default[length - (i + 1)];
          return total;
        }, 0);
      });
      table.push([end.subtract(length - (i + 1), 'days').format("YYYY/MM/DD")].concat(ary));
    });


    var graphData = google.visualization.arrayToDataTable(table);

    let ticks = getTicks(100);
    let options = {
      isStacked: true,
      width: width,
      height: height,
      legend: {position: 'right', maxLines: 3},
      // colors: colors,
      // curveType: 'function',
      vAxis: {
        ticks: ticks,
        minValue: 0
      }
    };

    var chart = new google.visualization.AreaChart(React.findDOMNode(this).querySelector('#graph'));

    chart.draw(graphData, options);
  }

  changePeriod(e) {
    this.setState({periodLength: parseInt(e.target.value, 10)})
  }

  componentDidUpdate() {
    this.drawChart();
  }

  render() {
    return this.state.ready ?
      <div className='user-statistics'>
        <div className='graph-action standard-form-horizontal'>
          <div className='field'>
            <select onChange={this.changePeriod.bind(this)}>
              <option value={31} >{I18n.t('user.stats.period.placeholder')}</option>
              <option value={1} >{I18n.t('user.stats.period.last_24h')}</option>
              <option value={7} >{I18n.t('user.stats.period.last_week')}</option>
              <option value={31} >{I18n.t('user.stats.period.last_month')}</option>
            </select>
          </div>
        </div>

        <div id='graph' />

        <div className='identities'>
          {this.state.identities.map((identity) => {
            return <span className={['icon', changeCase.snakeCase(identity.type) + '-logo'].join(' ')} />
          })}
        </div>
      </div> : <Loading />;
  }
}

export default UserStatistics;
