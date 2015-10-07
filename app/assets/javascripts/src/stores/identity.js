import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import changeCase from 'change-case';
import moment from 'moment';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';
import UserStore from '../stores/user';

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

  getUserIdentityById(id) {
    let identity = this.getIdentityById(id);
    if (identity.userId) {
      return UserStore.getUserById(identity.userId).identity();
    } else {
      return identity.name;
    }
  },

  parse(json) {
    return {
      id: json.id,
      userId: json.user_id,
      type: changeCase.pascalCase(json.type.match(/Identity(.+)/)[1]),
      primaryKey: json.primary_key,
      secondaryKey: json.secondary_key,
      isVerified: json.is_verified,
      name: json.name
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

