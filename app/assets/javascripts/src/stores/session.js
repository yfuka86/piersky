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

  getTeam() {
    if (!this.get('team')) this.set('team', {});
    return this.get('team');
  },

  setTeam(team) {
    this.set('team', team);
  },

  parseUser(json) {
    return {
      id: parseInt(json.id, 10),
      email: json.email,
      userName: json.user_name,
      teams: json.teams
    }
  },

  parseTeam(json) {
    return {
      id: parseInt(json.id, 10),
      name: json.name
    }
  }

});

SessionStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_USER:
      SessionStore.setUser(SessionStore.parseUser(action.json));
      SessionStore.emitChange();
      break;

    case ActionTypes.LOAD_TEAM:
      SessionStore.setTeam(SessionStore.parseTeam(action.json));
      SessionStore.emitChange();
      break;

    default:
  }

  return true;
});

export default SessionStore;

