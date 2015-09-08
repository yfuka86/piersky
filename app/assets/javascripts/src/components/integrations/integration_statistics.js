import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link} from 'react-router';
import Constants from '../../constants/app';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';
import UserStore from '../../stores/user';

import Slack from '../../components/statistics/slack';
import Github from '../../components/statistics/github';

const Statistics = {
  Slack: Slack,
  Github: Github
}

class IntegrationStatistics extends React.Component {
  static get defaultProps() {
    return {
      integration: []
    };
  }

  static get propTypes() {
    return {
      integration: React.PropTypes.object
    };
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    let integration = this.props.integration;
    let Integration = Statistics[integration.type];
    let integrationUser = UserStore.getUserById(integration.userId);

    return Integration ?
      <div className='integration-statistics'>
        <Integration integration={integration} />
      </div> : <span/>
  }
}

export default IntegrationStatistics;
