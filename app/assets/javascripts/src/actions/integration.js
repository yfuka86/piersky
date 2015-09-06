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
          Dispatcher.handleServerAction({
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
