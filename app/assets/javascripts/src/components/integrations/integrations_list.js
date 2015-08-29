import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

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
          return (
            <Link to='integrations-show' params={{id: integration.id}} key={integration.id}>
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
