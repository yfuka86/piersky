import request from 'superagent';
import Dispatcher from '../dispatcher';
import {APIRoot, APIEndpoints, ActionTypes} from '../constants/app';

export default {
  load() {
    return new Promise((resolve, reject) => {
      request
      .get(APIEndpoints.INTEGRATIONS)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleViewAction({
            type: ActionTypes.LOAD_INTEGRATIONS,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },
  loadStats() {
    return new Promise((resolve, reject) => {
      request
      .get(APIRoot + '/slack_wrapper')
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleViewAction({
            type: ActionTypes.LOAD_INTEGRATION_STATS,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  }
}
