import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';
import IntegrationsList from '../../components/integrations/integrations_list';

class IntegrationsBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
      integrations: IntegrationStore.getIntegrations()
    });
  }

  componentDidMount() {
    IntegrationStore.onChange(this.onChange);
    IntegrationAction.load();
  }

  componentWillUnmount() {
    IntegrationStore.offChange(this.onChange);
  }

  onChange(e) {
    this.setState(this.InitialState);
  }

  render() {
    return (
      <div className='integration-board container'>
        <div className='container-left'>
          <IntegrationsList integrations={this.state.integrations} />
        </div>
        <RouteHandler />
        <div className='clear-fix' />
      </div>
    );
  }
}

export default IntegrationsBoard;
