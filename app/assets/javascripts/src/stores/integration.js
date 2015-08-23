import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import changeCase from 'change-case';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const IntegrationStore = assign({}, BaseStore, {

  getIntegrations() {
    if (!this.get('integrations')) this.set('integrations', []);
    return this.get('integrations');
  },

  setIntegrations(integrations) {
    this.set('integrations', integrations);
  },

  getIntegrationById(id) {
    return _.find(this.getIntegrations(), (integration) => {
      return integration.id === parseInt(id, 10);
    }) || {};
  },

  parse(json) {
    return {
      id: json.id,
      type: changeCase.snakeCase(json.type.split('::')[1]),
      user: json.user,
      createdAt: json.created_at
    }
  }

});

IntegrationStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_INTEGRATIONS:
      IntegrationStore.setIntegrations(_.map(action.json.integrations, (integrationJson) => {
        return IntegrationStore.parse(integrationJson);}
      ));
      IntegrationStore.emitChange();
      break;

    default:
  }

  return true;
});

export default IntegrationStore;

