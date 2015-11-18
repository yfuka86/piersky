import React from 'react';
import {Link} from 'react-router';
import changeCase from 'change-case';
import _ from 'lodash';

import UserStore from '../../stores/user';

class IntegrationsList extends React.Component {
  static get defaultProps() {
    return {
      integrations: []
    };
  }

  static get propTypes() {
    return {
      integrations: React.PropTypes.array
    };
  }

  render() {
    return (
      <ul className='integrations-list'>
        <Link to='integrations-index'>
          <li>
            <div className='icon-area'>
              <span className='icon icon-ic_trending_up_24px' />
            </div>
            {I18n.t('integration.list.dashboard')}
          </li>
        </Link>
        <Link to='integrations-new'>
          <li>
            <div className='icon-area'>
              <span className='icon icon-ic_add_24px' />
            </div>
            {I18n.t('integration.list.add')}
          </li>
        </Link>
        {_.map(this.props.integrations, (integration) => {
          let integrationUser = UserStore.getUserById(integration.userId);
          return (
            <Link to='integration-show' params={{id: integration.id}} key={integration.id}>
              <li>
                <div className='icon-area'>
                  <span className={['icon', changeCase.snakeCase(integration.type) + '-logo'].join(' ')} />
                </div>
                {integration.name}
                <div className='description'>
                  <p className='user-name'>
                    {integrationUser.name || integrationUser.email}
                  </p>
                  <p className='date'>
                    {integration.createdAt.format('MMMM Do, YYYY')}
                  </p>
                </div>
              </li>
            </Link>
          )
        })}
      </ul>
    );
  }
}

export default IntegrationsList;
