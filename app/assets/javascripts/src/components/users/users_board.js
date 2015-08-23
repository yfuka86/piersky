import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

import SessionStore from '../../stores/session';
import UsersList from '../../components/users/users_list';

class UsersBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChange(e) {
    this.setState(this.InitialState);
  }

  render() {
    return (
      <div className='users-board container'>
        <div className='container-left'>
          <UsersList users={[SessionStore.getUser()]} />
        </div>
        <RouteHandler />
        <div className='clear-fix' />
      </div>
    );
  }
}

export default UsersBoard;
