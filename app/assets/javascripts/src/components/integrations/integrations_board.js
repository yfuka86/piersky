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
      integrations: IntegrationStore.getIntegrations(),
      objects: [ 
        {id: 1, name: "test", elems: [
          {type: "github", title: "internet"},
          {type: "slack", title: "chat"}]
        },
        {id: 2, name: "test2", elems: [
          {type: "github", title: "not_java"},
          {type: "slack", title: "chat"},
          {type: "slack", title: "chat"}
        ]
        }
      ]
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
      <div className='integrations-board container'>
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
