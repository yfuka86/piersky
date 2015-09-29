import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link} from 'react-router';
import Constants from '../../constants/app';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';
import StatisticsStore from '../../stores/statistics';

import Loading from '../../components/common/loading';
import Slack from '../../components/statistics/slack';
import Github from '../../components/statistics/github';

const Statistics = {
  Slack: Slack,
  Github: Github
}

class IntegrationStatistics extends React.Component {
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

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return this.getParamsFromStores(this.props);
  }

  getParamsFromStores(props) {
    let stat = StatisticsStore.getStatById(props.integration.id);
    return {
      stat: stat
    };
  }

  componentDidMount() {
    StatisticsStore.onChange(this.onChangeHandler);
    this._loadIntegrationStat(this.props.integration.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getParamsFromStores(nextProps));
    this._loadIntegrationStat(nextProps.integration.id);
  }

  componentWillUnmount() {
    StatisticsStore.offChange(this.onChangeHandler);
  }

  _loadIntegrationStat(id) {
    if (!StatisticsStore.getStatById(id) && !this.state.loading) {
      this.setState({loading: true}, () => {
        IntegrationAction.stat(id).then((res) => {
          this.setState({loading: false});
        });
      });
    }
  }

  onChange() {
    this.setState(this.initialState);
  }

  render() {
    let integration = this.props.integration;
    let Integration = Statistics[integration.type];

    return Integration && this.state.stat ?
      <div className='integration-statistics'>
        <Integration integration={integration} stat={this.state.stat} />
      </div> : <Loading/>
  }
}

export default IntegrationStatistics;
