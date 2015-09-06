import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link} from 'react-router';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';
import UserStore from '../../stores/user';

import Slack from '../../components/statistics/slack';
import Github from '../../components/statistics/github';

const Statistics = {
  Slack: Slack,
  Github: Github
}

class IntegrationsShow extends React.Component {

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
    let Integration = Statistics[integration.type];
    let integrationUser = UserStore.getUserById(integration.userId);
    return (
      <div className='container-main'>
        {integration.id ?
          <div className='integrations-show'>
            <div className='icon-area'>
              <span className={['icon', changeCase.snakeCase(integration.type) + '-logo'].join(' ')} />
            </div>
            <p className='title'>{integration.type}</p>
            <p className='description'>
              {I18n.t('integration.board.show_description', {
                userName: integrationUser.name || integrationUser.email,
                createdAt: integration.createdAt.format('MMMM Do, YYYY')})}
            </p>
            <div className='actions'>
              <Link to='integration-setting' params={{id: integration.id}}>
                <span className='icon icon-ic_settings_24px' />
              </Link>
            </div>
            {Integration ? <Integration integration={integration} /> : <span/> }
          </div>
        : <span/>}
      </div>
    );
  }
}

export default IntegrationsShow;
