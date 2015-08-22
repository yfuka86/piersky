import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';

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
    IntegrationAction.loadStats();
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
    return (
      <div className='container-main'>
        <p className='title'>{I18n.t('integration.board.show', {name: changeCase.pascalCase(this.state.integration.type)})}</p>
      </div>
    );
  }
}

export default IntegrationsShow;
