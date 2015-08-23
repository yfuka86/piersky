import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import Constants from '../../constants/app';

import IntegrationAction from '../../actions/integration';

class IntegrationsIndex extends React.Component {
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
        <p className='title'>{I18n.t('integration.board.index')}</p>
        <p className='subtitle'>
          {I18n.t('integration.general.no_integrations')}
          <Link to='integrations-new'>
            {I18n.t('integration.general.setup')}
          </Link>
        </p>
      </div>
    );
  }
}

export default IntegrationsIndex;
