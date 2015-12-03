import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import Constants from '../../constants/app';

import UserStore from '../../stores/user';

class UserSelect extends React.Component {
  static get defaultProps() {
    return {
      callback: () => {}
    };
  }

  static get propTypes() {
    return {
      callback: React.PropTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      users: UserStore.getUsers()
    };
  }

  render() {
    return (
      <div className='user-select field'>
        <select onChange={this.props.callback} {...this.props}>
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
