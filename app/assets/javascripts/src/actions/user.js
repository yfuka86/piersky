import request from 'superagent';
import Dispatcher from '../dispatcher';
import {ActionTypes, APIEndpoints, CSRFToken} from '../constants/app';

export default {
  stats(id) {
    return new Promise((resolve, reject) => {
      request
      .get(`${APIEndpoints.USERS}/${id}/stats`)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_USER_STATS,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },

  identities_stats(id, range) {
    return new Promise((resolve, reject) => {
      request
      .get(`${APIEndpoints.USERS}/${id}/identities_stats`)
      .query({range: range})
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve(json);
          Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_USER_IDENTITIES_STATS,
            json: json
          });
        } else {
          reject(res);
        }
      })
    });
  }
}
