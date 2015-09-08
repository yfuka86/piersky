import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import changeCase from 'change-case';
import moment from 'moment';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const IdentityStore = assign({}, BaseStore, {

  getIdentities() {
    if (!this.get('identities')) this.set('identities', []);
    return this.get('identities');
  },

  setIdentities(identities) {
    this.set('identities', identities);
  },

  getIdentityById(id) {
    return _.find(this.getIdentities(), (identity) => {
      return identity.id === parseInt(id, 10);
    }) || {};
  },

  getIdentitiesByUserId(userId) {
    return _.where(this.getIdentities(), {userId: parseInt(userId, 10)}) || [];
  },

  parse(json) {
    return {
      id: json.id,
      userId: json.user_id,
      type: changeCase.pascalCase(json.type.split('::')[1]),
      primaryKey: json.primary_key,
      secondaryKey: json.secondary_key,
      isVerified: json.is_verified
    }
  }

});

IdentityStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_IDENTITIES:
      IdentityStore.setIdentities(_.map(action.json.identities, (identityJson) => {
        return IdentityStore.parse(identityJson);}
      ));
      IdentityStore.emitChange();
      break;

    default:
  }

  return true;
});

export default IdentityStore;

