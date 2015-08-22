import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import Constants from '../constants/app';

import BaseStore from '../stores/base';

const SessionStore = assign({}, BaseStore, {

});

SessionStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {

    default:
  }

  return true;
});

export default SessionStore;

