import request from 'superagent';
import Dispatcher from '../dispatcher';
import {APIEndpoints, ActionTypes} from '../constants/app';

export default {
  load() {
    return new Promise((resolve, reject) => {
      request
      .get(APIEndpoints.INTEGRATIONS)
      .end((error, res) => {
        if (res.status === 200){
          json = JSON.parse(res.text);
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
  }
}
