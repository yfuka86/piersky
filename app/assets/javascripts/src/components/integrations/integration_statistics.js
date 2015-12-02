import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link} from 'react-router';
import Constants from '../../constants/app';

import IntegrationAction from '../../actions/integration';
import IdentityAction from '../../actions/identity';
import RouteAction from '../../actions/route';
import IntegrationStore from '../../stores/integration';
import IdentityStore from '../../stores/identity';
import StatisticsStore from '../../stores/statistics';

import IntegrationSyncing from '../../components/integrations/integration_syncing';
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
    let stats = StatisticsStore.getIntegrationStatsById(props.integration.id);
    return {
      stats: stats
    };
  }

  componentDidMount() {
    StatisticsStore.onChange(this.onChangeHandler);
    IdentityStore.onChange(this.onChangeHandler);
    if (this.props.integration.status === Constants.IntegrationStatus[2]) RouteAction.redirect('integration-settings', {id: this.props.integration.id});
    this._loadIntegrationStats(this.props.integration.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getParamsFromStores(nextProps));
    if (nextProps.integration.status === Constants.IntegrationStatus[2]) RouteAction.redirect('integration-settings', {id: nextProps.integration.id});
    this._loadIntegrationStats(nextProps.integration.id);
  }

  componentWillUnmount() {
    StatisticsStore.offChange(this.onChangeHandler);
    IdentityStore.offChange(this.onChangeHandler);
  }

  _loadIntegrationStats(id) {
    if (this.props.integration.status === Constants.IntegrationStatus[1]) return;
    if (!StatisticsStore.getIntegrationStatsById(id) && !this.state.loading) {
      this.setState({loading: true}, () => {
        IntegrationAction.stats(id).then((json) => {
          let hasIdentities = _.every(json.identities, (i) => {
            return _.size(IdentityStore.getIdentityById(i.id)) > 0;
          })
          if (!hasIdentities) {
            IdentityAction.load().then(() => {
              this.setState({loading: false});
            })
          } else {
            this.setState({loading: false});
          }
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

    if (integration.status === Constants.IntegrationStatus[1]) return <IntegrationSyncing integration={integration} />

    return Integration && this.state.stats ?
      <div className='integration-statistics'>
        <Integration integration={integration} stats={this.state.stats} />
      </div> : <Loading/>
  }
}

export default IntegrationStatistics;
