import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';

import SessionStore from '../../stores/session';
import UserStore from '../../stores/user';
import IdentityStore from '../../stores/identity';

class UsersShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return this.getParamsFromStores(this.props);
  }

  getParamsFromStores(props) {
    let user = UserStore.getUserById(props.params.id)
    return {
      user: user,
      identities: IdentityStore.getIdentitiesByUserId(user.id)
    };
  }

  componentDidMount() {
    this.drawChart();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getParamsFromStores(nextProps))
  }

  componentWillUnmount() {
  }

  drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['date', 'Slack', 'Github'],
      ['2015/08/07',  1000,      400],
      ['2015/08/08',  1170,      460],
      ['2015/08/09',  1660,       1120],
      ['2015/08/10',  1030,      540],
      ['2015/08/11',  1200,      400],
      ['2015/08/12',  117,      260],
      ['2015/08/13',  360,       100],
      ['2015/08/14',  1030,      540],
      ['2015/08/15',  900,      400],
      ['2015/08/16',  1170,      460],
      ['2015/08/17',  660,       1120],
      ['2015/08/18',  1030,      540],
      ['2015/08/19',  200,      100],
      ['2015/08/20',  370,      60],
      ['2015/08/21',  660,       1120],
      ['2015/08/22',  1000,      400],
      ['2015/08/23',  1170,      460]
    ]);

    var options = {
      title: 'activity',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph'));

    chart.draw(data, options);
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
