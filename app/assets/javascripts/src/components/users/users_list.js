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
        <Link to='users-index'>
          <li>
            <div className='icon-area'>
              <span className='icon icon-ic_trending_up_24px' />
            </div>
            {I18n.t('user.list.dashboard')}
          </li>
        </Link>
        <Link to='invitations'>
          <li>
            <div className='icon-area'>
              <span className='icon icon-ic_group_add_24px' />
            </div>
            {I18n.t('user.list.add')}
          </li>
        </Link>
        {_.map(this.props.users, (user) => {
          return (
            <Link to='users-show' params={{id: user.id}} key={user.id}>
              <li>
                <div className='icon-area'>
                  <UserIcon user={user} />
                </div>
                {user.name || user.email}
              </li>
            </Link>
          )
        })}
      </ul>
    );
  }
}

export default UsersList;
