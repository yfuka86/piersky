import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import changeCase from 'change-case';
import moment from 'moment';
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

  addIntegration(integration) {
    let integrations = this.getIntegrations();
    integrations.push(integration);
    this.setIntegrations(integrations);
  },

  replaceIntegration(integration) {
    let idx = _.findIndex(this.getIntegrations(), (i) => {
      return i.id === integration.id;
    })
    if (idx >= 0) {
      this.getIntegrations()[idx] = integration;
    } else {
      this.addIntegration(integration);
    }
  },

  removeIntegration(integration) {
    let integrations = this.getIntegrations();
    _.remove(integrations, (i)=> {
      return parseInt(i.id, 10) === integration.id;
    });
    this.setIntegrations(integrations);
  },

  parse(json) {
    return {
      id: json.id,
      type: json.type,
      label: json.label,
      userId: parseInt(json.user_id, 10),
      createdAt: moment(json.created_at),
      details: json.details
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

    case ActionTypes.LOAD_INTEGRATION:
      IntegrationStore.replaceIntegration(IntegrationStore.parse(action.json));
      IntegrationStore.emitChange();
      break;

    case ActionTypes.UPDATE_INTEGRATION:
      IntegrationStore.replaceIntegration(IntegrationStore.parse(action.json));
      IntegrationStore.emitChange();
      break;

    case ActionTypes.REMOVE_INTEGRATION:
      IntegrationStore.removeIntegration(IntegrationStore.parse(action.json));
      IntegrationStore.emitChange();
      break;

    default:
  }

  return true;
});

export default IntegrationStore;

