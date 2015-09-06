import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import changeCase from 'change-case';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const BalloonStore = assign({}, BaseStore, {

  getBalloon() {
    return this.get('balloon');
  },

  setBalloon(obj) {
    this.set('balloon', obj);
  },

  clearBalloon() {
    this.set('balloon', null);
  }
});

BalloonStore.setMaxListeners(100);

BalloonStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;

  switch(action.type) {
    case ActionTypes.SHOW_BALLOON:
      BalloonStore.setBalloon(action.options)
      BalloonStore.emitChange();
      break;

    case ActionTypes.CLOSE_BALLOON:
      BalloonStore.clearBalloon();
      BalloonStore.emitChange();
      break;

    default:
  }

  return true;
});

export default BalloonStore;

