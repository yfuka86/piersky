import React from 'react';
import _ from 'lodash';
import Constants from '../../constants/app';

import IntegrationAction from '../../actions/integration';

class IntegrationsNew extends React.Component {
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
        <p className='title'>{I18n.t('integration.new.title')}</p>
        <div className='row-list-selector'>
          {_.map(Constants.Integrations, (name) => {
            return (
              <div key={name} className='option'>
                <div className='icon-area'>
                  <span className={['icon', name + '-logo'].join(' ')} />
                </div>
                <div className='content-area'>
                  <p className='title'>{I18n.t('integration.' + name + '.name')}</p>
                </div>
                <div className='right-area'>
                  <a href={Constants.IntegrationEndpoint(name)}>
                    <button className='button-identity'>
                      {I18n.t('integration.general.connect')}
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default IntegrationsNew;
