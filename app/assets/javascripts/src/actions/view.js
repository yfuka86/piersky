import Dispatcher from '../dispatcher';
import {ActionTypes} from '../constants/app';

export default {
  showNotification(messages) {
    Dispatcher.handleViewAction({
      type: ActionTypes.SHOW_NOTIFICATION,
      messages: messages
    });
  }
};
