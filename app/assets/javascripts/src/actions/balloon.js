import Dispatcher from '../dispatcher';
import {ActionTypes} from '../constants/app';

export default {

  showBalloon(options) {
    Dispatcher.handleViewAction({
      type: ActionTypes.SHOW_BALLOON,
      options: options
    });
  },

  closeBalloon() {
    Dispatcher.handleViewAction({
      type: ActionTypes.CLOSE_BALLOON
    });
  }
};
