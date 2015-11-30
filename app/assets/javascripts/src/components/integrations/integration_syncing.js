import React from 'react';
import _ from 'lodash';

import IdentityAction from '../../actions/identity';
import IntegrationAction from '../../actions/integration';

class IntegrationSyncing extends React.Component {
  static get defaultProps() {
    return {
      integration: {}
    };
  }

  static get propTypes() {
    return {
      integration: React.PropTypes.object
    };
  }

  componentDidMount() {
    this.id = setInterval(() => {
      IdentityAction.load().then(() => {
        IntegrationAction.show(this.props.integration.id).then(() => {});
      });
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.id);
  }

  render() {
    return (
      <div className='syncing-container'>
        <p>{I18n.t('integration.general.syncing')}</p>
      </div>
    );
  }
}

export default IntegrationSyncing;
