import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link} from 'react-router';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';

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
    let integrationClass = changeCase.pascalCase(this.state.integration.type);
    let Integration = Statistics[integrationClass];
    let integration = this.state.integration;
    return (
      <div className='container-main'>
        {integration.id ?
          <div className='integrations-show'>
            <div className='icon-area'>
              <span className={['icon', integration.type + '-logo'].join(' ')} />
            </div>
            <p className='title'>{I18n.t('integration.board.show', {name: integrationClass})}</p>
            <Link to='integration-setting' params={{id: integration.id}}>
              setting
            </Link>
            {Integration ? <Integration integration={integration} /> : <span/> }
          </div>
        : <span/>}
      </div>
    );
  }
}

export default IntegrationsShow;
