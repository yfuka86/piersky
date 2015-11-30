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

  render() {
    let integration = this.props.integration;
    let IntegrationSettings = Settings[integration.type];
    let integrationUser = UserStore.getUserById(integration.userId);

    return integration.id ?
      <div className='integration-settings'>
        <p className='section-title'>{I18n.t('integration.board.settings')}</p>
        {IntegrationSettings ? <IntegrationSettings integration={integration} /> : <span/>}
      </div> : <span/>
  }
}

export default IntegrationSettings;
