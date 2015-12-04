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

  getUserByIdentityId(id) {
    let identity = this.getIdentityById(id);
    if (identity.userId) {
      return UserStore.getUserById(identity.userId)
    } else {
      return null;
    }
  },

  getUserIdentityById(id) {
    let user = this.getUserByIdentityId(id);
    return user ? user.identity : this.getIdentityById(id).name;
  },

  addIdentity(identity) {
    let identities = this.getIdentities();
    identities.push(identity);
    this.setIdentities(identities);
  },

  replaceIntegration(identity) {
    let idx = _.findIndex(this.getIdentities(), (i) => {
      return i.id === identity.id;
    })
    if (idx >= 0) {
      this.getIdentities()[idx] = identity;
    } else {
      this.addIdentity(identity);
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

    case ActionTypes.UPDATE_IDENTITY:
      IdentityStore.replaceIdentity(IdentityStore.parse(action.json));
      IdentityStore.emitChange();
      break;

    default:
  }

  return true;
});

export default IdentityStore;

