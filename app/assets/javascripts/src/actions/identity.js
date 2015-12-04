import request from 'superagent';
import Dispatcher from '../dispatcher';
import {APIRoot, APIEndpoints, ActionTypes, CSRFToken} from '../constants/app';

export default {
  load() {
    return new Promise((resolve, reject) => {
      request
      .get(APIEndpoints.IDENTITIES)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_IDENTITIES,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },

  update(params) {
    return new Promise((resolve, reject) => {
      request
      .put(`${APIEndpoints.IDENTITIES}/${params.id}`)
      .set('X-CSRF-Token', CSRFToken())
      .send(params)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve(res);
          Dispatcher.handleServerAction({
            type: ActionTypes.UPDATE_IDENTITY,
            json: json
          });
        } else {
          reject(res);
        }
      })
    });
  },
}