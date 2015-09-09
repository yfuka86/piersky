import React from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import {Link, RouteHandler} from 'react-router';

import IntegrationAction from '../../actions/integration';
import IntegrationStore from '../../stores/integration';
import UserStore from '../../stores/user';
import RouteStore from '../../stores/route';
import Loading from '../../components/common/loading';

class IntegrationShow extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return this.getParamsFromStores(this.props);
  }

  getParamsFromStores(props) {
    let integration = IntegrationStore.getIntegrationById(props.params.id)
    return {
      integration: integration
    };
  }

  componentDidMount() {
    IntegrationStore.onChange(this.onChangeHandler);
    this._loadIntegrationDetails(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getParamsFromStores(nextProps));
    this._loadIntegrationDetails(nextProps.params.id);
  }

  _loadIntegrationDetails(id) {
    if (!IntegrationStore.getIntegrationById(id).details) {
      IntegrationAction.show(id)
    }
  }

  componentWillUnmount() {
    IntegrationStore.offChange(this.onChangeHandler);
  }

  onChange(e) {
    this.setState(this.initialState);
  }

  render() {
    let integration = this.state.integration;
    let integrationUser = UserStore.getUserById(integration.userId);
    return (
      <div className='container-main'>
        {!integration.details ? <Loading /> :
          <div className='integration-show'>
            <div className='icon-area'>
              <span className={['icon', changeCase.snakeCase(integration.type) + '-logo'].join(' ')} />
            </div>
            <p className='title'>{integration.type}</p>
            <p className='description'>
              {I18n.t('integration.board.show_description', {
                userName: integrationUser.name || integrationUser.email,
                createdAt: integration.createdAt.format('MMMM Do, YYYY')})}
            </p>

            <div className='integration-inner sky-tab-area'>
              <ul className='sky-tab-list'>
                <Link to='integration-statistics' params={{id: integration.id}}>
                  <li className='sky-tab'>
                    {I18n.t('integration.show.tab.stats')}
                  </li>
                </Link>
                <Link to='integration-settings' params={{id: integration.id}}>
                  <li className='sky-tab'>
                    {I18n.t('integration.show.tab.settings')}
                  </li>
                </Link>
              </ul>
              <div className='sky-tab-panel'>
                <RouteHandler integration={integration} />
              </div>
            </div>
          </div>}
      </div>
    );
  }
}

export default IntegrationShow;
