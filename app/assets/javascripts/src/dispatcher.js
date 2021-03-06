import {Dispatcher} from 'flux';
import assign from 'object-assign';
import {PayloadSources} from './constants/app';

export default assign(new Dispatcher(), {
  handleServerAction(action) {
    var payload = {
      source: PayloadSources.SERVER_ACTION,
      action: action
    };
    this.dispatch(payload);
  },

  handleViewAction(action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  }
});
