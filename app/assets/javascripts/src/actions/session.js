import request from 'superagent';
import Dispatcher from '../dispatcher';
import {ActionTypes, APIEndpoints, CSRFToken} from '../constants/app';

export default {
  loadUser(){
    return new Promise((resolve, reject) => {
      request
      .get(`${APIEndpoints.USERS}/me`)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_USER,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },

  loadTeam(){
    return new Promise((resolve, reject) => {
      request
      .get(`${APIEndpoints.TEAMS}/current`)
      .end((error, res) => {
        if (res.status === 200){
          let json = JSON.parse(res.text);
          resolve();
          Dispatcher.handleServerAction({
            type: ActionTypes.LOAD_TEAM,
            json: json
          });
        } else {
          reject();
        }
      })
    });
  },

  logout(){
    request
    .del(APIEndpoints.LOGOUT)
    .set('X-CSRF-Token', CSRFToken())
    .end((error, res) => {
      location.href = '/sign_in';
    });
  }
}
