import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import Constants from '../../constants/app';

import moment from 'moment';
import UserIcon from '../../components/users/user_icon';

class UsersIndex extends React.Component {
  static get defaultProps() {
    return {
      users: []
    };
  }

  static get propTypes() {
    return {
      users: React.PropTypes.array
    };
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
    };
  }

  componentDidMount() {
    this.drawUsersChart();
    window.onresize = this.drawUsersChart.bind(this);
  }

  componentDidUpdate() {
    this.drawUsersChart();
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  drawUsersChart() {
    _.each(this.props.users, (user) => {this.drawUserChart(user)});
  }

  drawUserChart(user) {
    if (!user) return;
    let width = 300;
    let height = 54;
    let name = user.identity;

    let header = ['Day', name];
    let colors = [Constants.colorHexByKey(name)];
    let data = [header];

    let summary = user.summary.count;
    let length = summary.length
    // todo fix
    let end = moment(moment().format('YYYY MM DD'), 'YYYY MM DD');
    _.times(length, (i) => {
      let count = summary[length - (i + 1)];
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

    let chart = new google.visualization.LineChart(React.findDOMNode(this).querySelector(`#user_graph_${user.id}`));
    chart.draw(tableData, options);
  }

  render() {
    return (
      <div className='container-main'>
        <p className='title'>
          {I18n.t('webapp.users.index')}
          <Link to='invitations' className='title-right'>
            <button className='flat-button-orange'>{I18n.t('user.general.add')}</button>
          </Link>
        </p>
        <div className='users-index'>
          <div className='option-header'>
            <div className='content-area'>
              <div className='name' />
              <span className='right-content'>
                <p className='main-content activity'>{I18n.t('integration.general.activities')}<br/>{I18n.t('integration.index.last_31_days')}</p>
                <div className='user-graph' />
                <div className='link' />
              </span>
            </div>
          </div>

          {this.props.users.map((user) =>{
            let summary = user.summary
            return (
              <div className='option' key={user.id}>
                <div className='content-area'>
                  <div className='icon-area'>
                    <UserIcon user={user} />
                  </div>
                  <Link to='user-show' params={{id: user.id}} className='link'>
                    <p className='name'>
                      {user.identity}
                    </p>
                  </Link>

                  <span className='right-content'>
                    <p className='main-content activity'>{_.sum(user.summary.count)}</p>
                    <div className='user-graph' id={`user_graph_${user.id}`} />
                    <Link to='user-show' params={{id: user.id}} className='link'>
                      <button>{I18n.t('user.index.view_detail')}</button>
                    </Link>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default UsersIndex;
