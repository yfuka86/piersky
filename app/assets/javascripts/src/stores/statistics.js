import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import changeCase from 'change-case';
import moment from 'moment';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const StatisticsStore = assign({}, BaseStore, {

  getStats() {
    if (!this.get('stats')) this.set('stats', {});
    return this.get('stats');
  },

  setStats(stats) {
    this.set('stats', stats);
  },

  getStatById(id) {
    return this.getStats()[id];
  },

  addStat(id, stat) {
    let stats = this.getStats();
    stats[id] = stat;
    this.setStats(stats);
  }
});

StatisticsStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_INTEGRATION_STAT:
      StatisticsStore.addStat(action.json.integration_id, action.json);
      StatisticsStore.emitChange();
      break;

    default:
  }

  return true;
});

export default StatisticsStore;

