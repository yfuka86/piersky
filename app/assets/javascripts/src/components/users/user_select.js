import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import Constants from '../../constants/app';

import UserStore from '../../stores/user';

class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      users: UserStore.getUsers(),
      value: this.props.value || '-1'
    };
  }

  onChangeSelect(e) {
    this.setState({value: e.target.value});
    if (_.isFunction(this.props.onChange)) this.props.onChange(e);
  }

  render() {
    return (
      <div className='user-select field'>
        <select onChange={this.onChangeSelect.bind(this)} value={this.state.value}>
          {[
            <option key={-1} value='-1'>{I18n.t('user.identity.placeholder')}</option>
          ].concat(
            this.state.users.map(function (user) {
              return <option key={user.id} value={user.id}>{user.identity}</option>
            })
          )};
        </select>
      </div>
    );
  }
}

export default UserSelect;
