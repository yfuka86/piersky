import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Constants from '../../constants/app';

import UserIcon from '../../components/users/user_icon';

class UserInfo extends React.Component {
  static get defaultProps() {
    return {
      user: {}
    };
  }

  static get propTypes() {
    return {
      user: React.PropTypes.object
    };
  }

  render() {
    let user = this.props.user;

    return (
      <div className='user-info-container'>
        <div className='user-info-wrapper'>
          <UserIcon user={user} />
          <div className='user-info'>
            <span className='user-info-inner'>
              <Link to='user-show' params={{id: user.id}}>
                <span className='user-name'>
                  {user.name || user.email}
                </span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default UserInfo;
