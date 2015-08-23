import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const SessionStore = assign({}, BaseStore, {

  getUser() {
    return this.get('user');
  }

});

SessionStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.AUTHENTICATE
      action.json

    default:
  }

  return true;
});

export default SessionStore;

