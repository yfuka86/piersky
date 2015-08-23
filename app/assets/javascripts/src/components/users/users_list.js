import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

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
        {_.map(this.props.users, (integration) => {
          return (
            <Link to='users-show' params={{id: integration.id}} key={integration.id}>
              <li>
                <div className='icon-area'>
                  <span className={['icon', integration.type + '-logo'].join(' ')} />
                </div>
                {integration.type}
              </li>
            </Link>
          )
        })}
      </ul>
    );
  }
}

export default IntegrationsList;
