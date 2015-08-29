import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const TeamStore = assign({}, BaseStore, {

  getTeam() {
    if (!this.get('team')) this.set('team', {});
    return this.get('team');
  },

  setTeam(team) {
    this.set('team', team);
  },

  parse(json) {
    return {
      id: json.id
    }
  }
});

TeamStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_TEAM:
      TeamStore.setTeam(TeamStore.parse(action.json));
      TeamStore.emitChange();
      break;

    default:
  }

  return true;
});

export default TeamStore;

