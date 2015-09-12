import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import Constants from '../../constants/app';
import ReactD3 from 'react-d3-components'

import IntegrationStore from '../../stores/integration';

import IntegrationAction from '../../actions/integration';

class IntegrationsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {};
  }

  render() {
    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('integration.board.index')}</p>
        <p className='subtitle'>
          {I18n.t('integration.general.no_integrations')}
        </p>
        <p className='subtitle'>
          <Link to='integrations-new'>
            {I18n.t('integration.general.setup')}
          </Link>
        </p>
      </div>
    );
  }
}

export default IntegrationsIndex;
