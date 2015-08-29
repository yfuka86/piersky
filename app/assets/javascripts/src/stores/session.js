import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const SessionStore = assign({}, BaseStore, {

  getUser() {
    if (!this.get('user')) this.set('user', {});
    return this.get('user');
  },

  setUser(user) {
    this.set('user', user);
  },

  parse(json) {
    return {
      id: json.id,
      email: json.email,
      userName: json.user_name,
      teams: json.teams
    }
  }
});

SessionStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_USER:
      SessionStore.setUser(SessionStore.parse(action.json));
      SessionStore.emitChange();
      break;

    default:
  }

  return true;
});

export default SessionStore;

