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
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return _.extend({
      integrations: IntegrationStore.getIntegrations()
    });
  }

  componentDidMount() {
    IntegrationStore.onChange(this.onChangeHandler);
    IntegrationAction.load();
  }

  componentWillUnmount() {
    IntegrationStore.offChange(this.onChangeHandler);
  }

  onChange(e) {
    this.setState(this.initialState);
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
