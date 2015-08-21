import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import Constants from '../constants/app';

import BaseStore from '../stores/BaseStore';

const RouteStore = assign({}, new BaseStore, {

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

RouteStore.dispatchToken = Dispatcher.register(function(payload) {
  Dispatcher.waitFor([
  ]);

  var action = payload.action;

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

