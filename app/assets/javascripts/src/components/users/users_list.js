import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import UserIcon from '../../components/users/user_icon';

class UsersList extends React.Component {
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

  render() {
    return (
      <ul className='users-list'>
        {_.map(this.props.users, (user) => {
          return (
            <Link to='users-show' params={{id: user.id}} key={user.id}>
              <li>
                <div className='icon-area'>
                  <UserIcon user={user} />
                </div>
                {user.userName}
              </li>
            </Link>
          )
        })}
      </ul>
    );
  }
}

export default UsersList;
