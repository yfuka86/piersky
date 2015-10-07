import React from 'react';
import _ from 'lodash';

class IntegrationSyncing extends React.Component {
  render() {
    return (
      <div className='syncing-container'>
        <p>{I18n.t('integration.general.syncing')}</p>
      </div>
    );
  }
}

export default IntegrationSyncing;
