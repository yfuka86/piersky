import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';

import SessionStore from '../../stores/session';
import UserStore from '../../stores/user';
import IdentityStore from '../../stores/identity';
import IntegrationStore from '../../stores/integration';
import IntegrationAction from '../../actions/integration';
//import IdentityAction from '../../actions/integration';
import StatisticsStore from '../../stores/statistics';
import moment from 'moment';

class UsersShow extends React.Component {
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
      return StatisticsStore.getStatById(integ.id)==null;
    }).map((integ) => {
      return IntegrationAction.stat(integ.id);
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
    if(!this.state.ready)  return;
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

    var options = {
      title: 'activity',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(React.findDOMNode(this).querySelector('#graph'));

    chart.draw(graphData, options);
  }

  changePeriod(e) {
    this.setState({periodLength: parseInt(e.target.value, 10)})
  }

  componentDidUpdate() {
    this.drawChart();
  }

  render() {
    return (
      <div className='container-main users-show'>
        <p className='title'>{this.state.user.name || this.state.user.email}</p>
        <div className='identities'>
          {this.state.identities.map((identity) => {
            return <span className={['icon', changeCase.snakeCase(identity.type) + '-logo'].join(' ')} />
          })}
        </div>
        <div className='field'>
          <select onChange={this.changePeriod.bind(this)}>
            <option value={31} >{I18n.t('integration.slack.period.placeholder')}</option>
            <option value={7} >{I18n.t('integration.slack.period.last_week')}</option>
            <option value={31} >{I18n.t('integration.slack.period.last_month')}</option>
          </select>
        </div>
        <div id='graph' />
      </div>
    );
  }
}

export default UsersShow;
