import request from 'superagent';
import Dispatcher from '../dispatcher';
import {ActionTypes, APIEndpoints, CSRFToken} from '../constants/app';

export default {
  load() {
    return new Promise((resolve, reject) => {
      request
      .get(APIEndpoints.INVITATIONS)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_INVITATIONS,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },


  create(params) {
    return new Promise((resolve, reject) => {
      request
      .post(APIEndpoints.INVITATIONS)
      .set('X-CSRF-Token', CSRFToken())
      .send(params)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.CREATE_INVITATIONS,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },

  resend(id) {
    return new Promise((resolve, reject) => {
      request
      .put(APIEndpoints.INVITATIONS + '/' + id)
      .set('X-CSRF-Token', CSRFToken())
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.RESENT_INVITATIONS,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },

  revoke(id) {
    return new Promise((resolve, reject) => {
      request
      .del(APIEndpoints.INVITATIONS + '/' + id)
      .set('X-CSRF-Token', CSRFToken())
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.REVOKE_INVITATIONS,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  }
}