import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

import UserStore from '../stores/user';
import UserIcon from '../components/users/user_icon';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return {
      users: UserStore.getUsers()
    };
  }

  componentDidMount() {
    UserStore.onChange(this.onChangeHandler);
  }

  componentWillUnmount() {
    UserStore.offChange(this.onChangeHandler);
  }

  onChange(e) {
    this.setState(this.InitialState);
  }

  render() {
    return (
      <div className='home container'>
        <p className='title'>{I18n.t('webapp.home.index')}</p>
        <div className='team-summary'>
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
    );
  }
}

export default Home;
