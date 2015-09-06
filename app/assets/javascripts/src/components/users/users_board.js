import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

import UserStore from '../../stores/user';
import UsersList from '../../components/users/users_list';

class UsersBoard extends React.Component {
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
      <div className='users-board container'>
        <div className='container-left'>
          <UsersList users={this.state.users} />
        </div>
        <RouteHandler />
        <div className='clear-fix' />
      </div>
    );
  }
}

export default UsersBoard;
