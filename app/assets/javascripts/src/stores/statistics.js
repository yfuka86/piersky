import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import changeCase from 'change-case';
import moment from 'moment';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const StatisticsStore = assign({}, BaseStore, {

  getIntegrationStats() {
    if (!this.get('integrationStats')) this.set('integrationStats', {});
    return this.get('integrationStats');
  },

  setIntegrationStats(stats) {
    this.set('integrationStats', stats);
  },

  getIntegrationStatsById(id) {
    return this.getIntegrationStats()[id];
  },

  addIntegrationStats(id, stats) {
    let integrationStats = this.getIntegrationStats();
    integrationStats[id] = stats;
    this.setIntegrationStats(integrationStats);
  },

  getUserStats() {
    if (!this.get('userStats')) this.set('userStats', {});
    return this.get('userStats');
  },

  setUserStats(stats) {
    this.set('userStats', stats);
  },

  getUserStatsById(id) {
    return this.getUserStats()[id];
  },

  addUserStats(id, stats) {
    let userStats = this.getUserStats();
    userStats[id] = stats;
    this.setUserStats(userStats);
  }
});

StatisticsStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_INTEGRATION_STATS:
      StatisticsStore.addIntegrationStats(action.json.integration_id, action.json);
      StatisticsStore.emitChange();
      break;

    case ActionTypes.LOAD_USER_STATS:
      StatisticsStore.addUserStats(action.json.user_id, action.json);
      StatisticsStore.emitChange();
      break;

    default:
  }

  return true;
});

export default StatisticsStore;

