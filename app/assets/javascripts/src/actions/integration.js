import Dispatcher from '../dispatcher';
import {ActionTypes} from '../constants/app';

export default {
  load() {
    Dispatcher.handleViewAction({
      type: ActionTypes.TRANSITION,
      handler: handler,
      state: state
    });
  }
}
