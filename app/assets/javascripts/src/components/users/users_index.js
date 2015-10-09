import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import Constants from '../../constants/app';

class UsersIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
    });
  }

  render() {
    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('webapp.users.index')}</p>
        <div className='users-index'>
          <div className='option-header'>
            <div className='content-area'>
              <div className='name' />
              <span className='right-content'>
                <p className='main-content activity'>{I18n.t('integration.general.activities')}<br/>{I18n.t('integration.index.last_31_days')}</p>
                <div className='integration-graph' />
                <div className='link' />
              </span>
            </div>
          </div>

          {this.state.integrations.map((integration) =>{
            let integrationUser = UserStore.getUserById(integration.userId);
            let summary = integration.summary
            return (
              <div className='option' key={integration.id}>
                <div className='content-area'>
                  <div className='icon-area'>
                    <span className={['icon', changeCase.snakeCase(integration.type) + '-logo'].join(' ')} />
                  </div>
                  <Link to='integration-show' params={{id: integration.id}} className='link'>
                    <p className='name'>
                      {integration.name()}
                    </p>
                  </Link>

                  <span className='right-content'>
                    <p className='main-content activity'>{_.sum(integration.summary)}</p>
                    <div className='integration-graph' id={`integration_graph_${integration.id}`} />
                    <Link to='integration-show' params={{id: integration.id}} className='link'>
                      <button>{I18n.t('integration.index.view_detail')}</button>
                    </Link>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default UsersIndex;
