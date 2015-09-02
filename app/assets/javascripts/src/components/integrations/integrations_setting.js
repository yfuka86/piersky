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
    let integration = this.state.integration;
    let IntegrationSetting = Settings[integration.type];
    let integrationUser = UserStore.getUserById(integration.userId);

    return integration.id ?
      <div className='container-main'>
        <div className='breadcrumb'>
          <div className='link'>
            <Link to='integrations-show' params={{id: integration.id}} >
              {I18n.t('integration.breadcrumb.show')}
            </Link>
          </div>
          <div className='current'>
            <span>
              {I18n.t('integration.breadcrumb.settings')}
            </span>
          </div>
        </div>
        <div className='integrations-setting'>
          <div className='icon-area'>
            <span className={['icon', changeCase.snakeCase(integration.type) + '-logo'].join(' ')} />
          </div>
          <p className='title'>{`${I18n.t('integration.board.settings')} ${integration.type}`}</p>
          <p className='description'>
            {I18n.t('integration.board.show_description', {
              userName: integrationUser.name || integrationUser.email,
              createdAt: integration.createdAt.format('MMMM Do, YYYY')})}
          </p>
          {IntegrationSetting ? <IntegrationSetting integration={this.state.integration} /> : <span/>}
        </div>
      </div> : <span/>
  }
}

export default IntegrationsSetting;
