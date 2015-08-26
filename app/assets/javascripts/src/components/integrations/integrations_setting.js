import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import Constants from '../../constants/app';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';

import Slack from '../../components/integrations/settings/slack';
import Github from '../../components/integrations/settings/github';

const Settings = {
  Slack: Slack,
  Github: Github
}


class IntegrationsSetting extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return _.extend({
      integration: IntegrationStore.getIntegrationById(this.props.params.id)
    });
  }

  componentDidMount() {
    IntegrationStore.onChange(this.onChangeHandler);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({integration: IntegrationStore.getIntegrationById(nextProps.params.id)})
  }

  componentWillUnmount() {
    IntegrationStore.offChange(this.onChangeHandler);
  }

  onChange(e) {
    this.setState(this.InitialState);
  }

  render() {
    let integrationClass = changeCase.pascalCase(this.state.integration.type);
    let IntegrationSetting = Settings[integrationClass];
    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('integration.board.settings', {name: integrationClass})}</p>
        {IntegrationSetting ? <IntegrationSetting integration={this.state.integration} /> : <span/> }
      </div>
    );
  }
}

export default IntegrationsSetting;
