import Dispatcher from '../dispatcher';
import {ActionTypes} from '../constants/app';

export default {
  transition(handler, state) {
    Dispatcher.handleViewAction({
      type: ActionTypes.TRANSITION,
      handler: handler,
      state: state
    });
  },

  redirect(route, params) {
    Dispatcher.handleViewAction({
      type: ActionTypes.REDIRECT,
      route: route,
      params: params
    });
  }
}
