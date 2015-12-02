import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link} from 'react-router';
import Constants from '../../constants/app';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';
import UserStore from '../../stores/user';

import Slack from '../../components/integrations/settings/slack';
import Github from '../../components/integrations/settings/github';

const Settings = {
  Slack: Slack,
  Github: Github
}

class IntegrationSettings extends React.Component {
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
    // this is subview so props won't be changed and will be newly mounted
    if (this.props.integration.status === Constants.IntegrationStatus[2]) {
      window.addEventListener("beforeunload", this.alertConfirmation);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.alertConfirmation);
  }

  alertConfirmation(e) {
    let confirmationMessage = I18n.t('integration.settings.unset_confirm');

    e.returnValue = confirmationMessage;     // Gecko and Trident
    return confirmationMessage;              // Gecko and WebKit
  }

  render() {
    let integration = this.props.integration;
    let IntegrationSettings = Settings[integration.type];
    let integrationUser = UserStore.getUserById(integration.userId);

    return integration.id ?
      <div className='integration-settings'>
        <p className='section-title'>{I18n.t('integration.settings.title')}</p>
        {IntegrationSettings ? <IntegrationSettings integration={integration} /> : <span/>}
      </div> : <span/>
  }
}

export default IntegrationSettings;
