import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const RouteStore = assign({}, BaseStore, {

  getRouter: function() {
    window.PierSky.Router;
  },

  getRouteNames: function() {
    if (!this.get('routeNames')) {
      this.setRouteNames([]);
    }
    this.get('routeNames');
  },

  setRouteNames: function(names) {
    this.set('routeNames', names);
  }
});

RouteStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {

    case ActionTypes.TRANSITION:
      RouteStore.setRouteNames(_.pluck(action.state.routes, 'name'));
      RouteStore.emitChange();
      break;

    case ActionTypes.REDIRECT:
      RouteStore.getRouter().transitionTo(action.route, action.params);
      break;

    default:
  }

  return true;
});

export default RouteStore;

