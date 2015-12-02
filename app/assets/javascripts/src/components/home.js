import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import Constants from '../constants/app';

import RouteAction from '../actions/route';
import UserStore from '../stores/user';
import TeamStore from '../stores/team';
import UserIcon from '../components/users/user_icon';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return {
      users: UserStore.getUsers(),
      summary: TeamStore.getTeam().summary,
      periodLength: 1,
      data: {
        activities: 0
      },
    };
  }

  componentDidMount() {
    TeamStore.onChange(this.onChangeHandler);
    UserStore.onChange(this.onChangeHandler);
    this.calculateSummary();
    this.drawUsersChart();
    window.onresize = this.drawUsersChart.bind(this);
  }

  componentDidUpdate() {
    this.drawUsersChart();
  }

  componentWillUnmount() {
    TeamStore.onChange(this.onChangeHandler);
    UserStore.offChange(this.onChangeHandler);
    window.onresize = null;
  }

  onChange(e) {
    this.setState(this.InitialState);
  }

  changePeriod(e) {
    this.setState({periodLength: parseInt(e.target.value, 10)}, () => {
      this.calculateSummary();
    })
  }

  calculateSummary() {
    let length = this.state.periodLength;
    let count = 0;
    if (length === 1) {
      count = this.state.summary.activities.day
    } else if (length === 7) {
      count = this.state.summary.activities.week
    } else {
      count = this.state.summary.activities.month
    }
    this.setState({data: {activities: count}});
  }

  drawUsersChart() {
    if (this.state.periodLength === 1) return;
    _.each(this.state.users, (user) => {this.drawUserChart(user)});
  }

  drawUserChart(user) {
    if (!user) return;
    let width = 400;
    let height = 54;
    let name = user.identity;

    let header = ['Day', name];
    let colors = [Constants.colorHexByKey(name)];
    let data = [header];

    let summary = user.summary.count;
    let length = this.state.periodLength;
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
      <div className='home container'>
        <p className='title'>
          {I18n.t('webapp.home.index')}
          <Link to='invitations' className='title-right'>
            <button className='flat-button-orange'>{I18n.t('user.general.add')}</button>
          </Link>
          <Link to='integrations-new' className='title-right'>
            <button className='flat-button-green'>{I18n.t('integration.general.add')}</button>
          </Link>
        </p>
        <div className='team-summary'>
          <div className='graph-action standard-form-horizontal'>
            <div className='field'>
              <select onChange={this.changePeriod.bind(this)}>
                <option value={1} >{I18n.t('webapp.home.period.last_24_hours')}</option>
                <option value={7} >{I18n.t('webapp.home.period.last_7_days')}</option>
                <option value={31} >{I18n.t('webapp.home.period.last_1_month')}</option>
              </select>
            </div>
          </div>

          <div className='summary'>
            <div className='panel'>
              <div className='name'>{I18n.t('webapp.home.summary.activities')}</div>
              <div className='number'>{this.state.data.activities}</div>
            </div>
            <div className='panel'>
              <div className='name'>{I18n.t('webapp.home.summary.members')}</div>
              <div className='number'>{this.state.users.length}</div>
            </div>
          </div>

          <div className='users'>
            <div className='option-header'>
              <div className='content-area'>
                <p className='main-content name'>{I18n.t('webapp.home.users.member')}</p>
                <span className='right-content'>
                  <p className='main-content activity'>{I18n.t('webapp.home.users.activities')}</p>
                  <div className='user-graph' />
                  <div className='link' />
                </span>
              </div>
            </div>

            {this.state.users.map((user) => {
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
                      <p className='main-content activity'>
                        {this.state.periodLength === 1 ?
                         (user.summary.recent.Slack || 0) + (user.summary.recent.Github || 0) :
                         _.sum(user.summary.count.slice(0, this.state.periodLength))}
                      </p>
                      {this.state.periodLength === 1 ?
                        <div className='user-graph recent'>
                          <span className={['icon', 'slack-logo'].join(' ')} />
                          {user.summary.recent.Slack || 0}
                          <span className={['icon', 'github-logo'].join(' ')} />
                          {user.summary.recent.Github || 0}
                        </div> :
                        <div className='user-graph' id={`user_graph_${user.id}`} />}
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
      </div>
    );
  }
}

export default Home;
