import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

import IntegrationsList from '../integrations/integrations_list';

class IntegrationsBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get InitialState() {
    return _.extend({
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChange(e) {
    this.setState(this.InitialState);
  }

  render() {
    return (
      <div className='integration-board container'>
        <div className='container-left'>
          <IntegrationsList />
        </div>
        <RouteHandler />
        <div className='clear-fix' />
      </div>
    );
  }
}

export default IntegrationsBoard;
