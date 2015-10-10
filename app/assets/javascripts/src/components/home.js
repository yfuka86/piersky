import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

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
      }
    };
  }

  componentDidMount() {
    TeamStore.onChange(this.onChangeHandler);
    UserStore.onChange(this.onChangeHandler);
    this.calculateSummary();
  }

  componentWillUnmount() {
    TeamStore.onChange(this.onChangeHandler);
    UserStore.offChange(this.onChangeHandler);
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

  render() {
    return (
      <div className='home container'>
        <p className='title'>{I18n.t('webapp.home.index')}</p>
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

            {this.state.users.map((user) =>{
              let summary = user.summary
              return (
                <div className='option' key={user.id}>
                  <div className='content-area'>
                    <div className='icon-area'>
                      <UserIcon user={user} />
                    </div>
                    <Link to='user-show' params={{id: user.id}} className='link'>
                      <p className='name'>
                        {user.identity()}
                      </p>
                    </Link>

                    <span className='right-content'>
                      <p className='main-content activity'>{_.sum(user.summary)}</p>
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
      </div>
    );
  }
}

export default Home;
