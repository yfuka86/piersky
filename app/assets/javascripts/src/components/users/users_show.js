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
    let data= {};
    data["Slack"]=[
      1000,
      1170,
      1660,
      1030,
      1200,
      117,
      360,
      1030,
      900,
      1170,
      660,
      1030,
      200,
      370,
      660,
      1000,
      1170
    ];
    data["Github"] = [
      400,
      460,
      1120,
      540,
      400,
      260,
      100,
      540,
      400,
      460,
      1120,
      540,
      100,
      60,
      1120,
      400,
      460
    ];

    return {
      user: user,
      identities: IdentityStore.getIdentitiesByUserId(user.id),
      integrations: IntegrationStore.getIntegrations(),
      statistics: StatisticsStore.getStats(),
      data: data
    };
  }

  componentDidMount() {


    IntegrationAction.load().then(() => {
      let p = IntegrationStore.getIntegrations().filter((integ) => {
        return StatisticsStore.getStatById(integ.id)==null;
      }).map((integ) => {
        console.log("send stat");
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

    let integrations = _.groupBy(this.state.integrations, (integration) => {
      return integration.type;
    });

    var table =[['Date'].concat(_.map(integrations,(_,key) => key))];
    let length = 10;
    let end = new Date(2014, 8, 25);
    _.times(length, (i) =>{
      let ary = _.map(integrations,(group, key) => {
        return data[key][length - (i+1)];
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
