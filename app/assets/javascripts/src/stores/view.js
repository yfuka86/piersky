import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import {ActionTypes} from '../constants/app';
import {getUid} from '../utils/app_module';

import BaseStore from '../stores/base';

const ViewStore = assign({}, BaseStore, {

  getMessages() {
    if (!this.get('messages')) {
      this.setMessages({});
    }
    return this.get('messages');
  },

  setMessages(messages) {
    this.set('messages', messages);
    this.set('uid', getUid());
  },

  getMessagesUid() {
    return this.get('uid');
  }
});

ViewStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {

    case ActionTypes.SHOW_NOTIFICATION:
      RouteStore.setMessages(action.messages);
      RouteStore.emitChange();
      break;

    default:
  }

  return true;
});

export default ViewStore;

