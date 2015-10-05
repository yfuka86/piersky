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
    console.log(props);
    this.state = this.initialState;
  }

  get initialState() {
    return this.getParamsFromStores(this.props);
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

  componentDidMount() {

    IntegrationAction.load().then(() => {
      let p = IntegrationStore.getIntegrations().filter((integ) => {
        return StatisticsStore.getStatById(integ.id)==null;
      }).map((integ) => {
        return IntegrationAction.stat(integ.id);
      })
      return Promise.all(p);
    }).then(() =>{
      this.setState(this.getParamsFromStores(this.props));
      this.drawChart();
    });
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
    let data = this.state.data;
    console.log(this.state);

    let identities = this.state.identities;
    let integrations = _.groupBy(this.state.integrations, (integration) => {
      return integration.type;
    });
    let statistics = this.state.statistics;

    var table =[['Date'].concat(_.map(integrations,(_,key) => key))];
    let length = 31;
    let end = new Date(2014, 8, 25);
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
      table.push([moment().subtract(length - (i + 1), 'days').format("YYYY/MM/DD")].concat(ary));
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

  render() {
    return (
      <div className='container-main users-show'>
        <p className='title'>{this.state.user.name || this.state.user.email}</p>
        <div className='identities'>
          {this.state.identities.map((identity) => {
            return <span className={['icon', changeCase.snakeCase(identity.type) + '-logo'].join(' ')} />
          })}
        </div>
        <div id='graph' />
      </div>
    );
  }
}

export default UsersShow;
