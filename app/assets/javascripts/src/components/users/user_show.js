import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link, RouteHandler} from 'react-router';

import RouteStore from '../../stores/route';
import UserStore from '../../stores/user';
import UserIcon from '../../components/users/user_icon';

class UserShow extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return this.getParamsFromStores(this.props);
  }

  getParamsFromStores(props) {
    let user = UserStore.getUserById(props.params.id)
    return {
      user: user
    };
  }

  componentDidMount() {
    UserStore.onChange(this.onChangeHandler);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getParamsFromStores(nextProps));
  }

  componentWillUnmount() {
    UserStore.offChange(this.onChangeHandler);
  }

  onChange() {
    this.setState(this.initialState);
  }

  render() {
    let user = this.state.user;
    let lastRouteName = _.last(RouteStore.getRouteNames());
    return (
      <div className='container-main'>
        <div className='user-show'>
          <p className='title'><UserIcon user={user} />{user.identity}</p>

          <div className='user-inner sky-tab-area'>
            <ul className='sky-tab-list'>
              <Link to='user-statistics' params={{id: user.id}} className={lastRouteName ? '' : 'active'}>
                <li className='sky-tab'>
                  {I18n.t('user.show.tab.stats')}
                </li>
              </Link>
              <Link to='user-profile' params={{id: user.id}}>
                <li className='sky-tab'>
                  {I18n.t('user.show.tab.profile')}
                </li>
              </Link>
            </ul>
            <div className='sky-tab-panel'>
              <RouteHandler user={user} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserShow;
