import request from 'superagent';
import Dispatcher from '../dispatcher';
import {ActionTypes, APIEndpoints, CSRFToken} from '../constants/app';

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
  },

  show(id) {
    return new Promise((resolve, reject) => {
      request
      .get(`${APIEndpoints.INTEGRATIONS}/${id}`)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_INTEGRATION,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },

  stats(id) {
    return new Promise((resolve, reject) => {
      request
      .get(`${APIEndpoints.INTEGRATIONS}/${id}/stats`)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve(json);
          Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_INTEGRATION_STATS,
            json: json
          });
        } else {
          reject(res);
        }
      })
    });
  },

  update(params) {
    return new Promise((resolve, reject) => {
      request
      .put(`${APIEndpoints.INTEGRATIONS}/${params.id}`)
      .set('X-CSRF-Token', CSRFToken())
      .send(params)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve(res);
          Dispatcher.handleServerAction({
            type: ActionTypes.UPDATE_INTEGRATION,
            json: json
          });
        } else {
          reject(res);
        }
      })
    });
  },

  remove(id) {
    return new Promise((resolve, reject) => {
      request
      .del(`${APIEndpoints.INTEGRATIONS}/${id}`)
      .set('X-CSRF-Token', CSRFToken())
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.REMOVE_INTEGRATION,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  }
}
