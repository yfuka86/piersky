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
    let date = [
      '2015/08/07',
      '2015/08/08',
      '2015/08/09',
      '2015/08/10',
      '2015/08/11',
      '2015/08/12',
      '2015/08/13',
      '2015/08/14',
      '2015/08/15',
      '2015/08/16',
      '2015/08/17',
      '2015/08/18',
      '2015/08/19',
      '2015/08/20',
      '2015/08/21',
      '2015/08/22',
      '2015/08/23'
    ];
    let data=[ { type: "Slack", data:[
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
    ]},
    { type: "Github", data:[
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
    ]}
    ];

    return {
      user: user,
      identities: IdentityStore.getIdentitiesByUserId(user.id),
      date: date,
      data: data
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

  onChange(e) {
    this.setState(this.getParamsFromStores(this.props));
    this.drawChart();
  }

  drawChart() {
    var column =['date'];
    var values = this.state.date;
    this.state.data.forEach((item, idx) => {
      column = column.concat([item.type]);
      item.data.forEach((val,jdx) => {
        if(idx==0) values[jdx] = [values[jdx],val];
        else values[jdx] = values[jdx].concat([val]);
      });
    });
    var arr = [column].concat(values);
    var data = google.visualization.arrayToDataTable(arr);

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
