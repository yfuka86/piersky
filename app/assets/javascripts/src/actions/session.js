import request from 'superagent';
import Dispatcher from '../dispatcher';
import {APIEndpoints, CSRFToken} from '../constants/app';

export default {
  logout(){
    request
    .del(APIEndpoints.LOGOUT)
    .set('X-CSRF-Token', CSRFToken())
    .end((error, res) => {
      location.href = '/sign_in';
    });
  }
}
