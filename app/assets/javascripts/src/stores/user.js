import Dispatcher from '../dispatcher';
import assign from 'object-assign';
import _ from 'lodash';
import { ActionTypes } from '../constants/app';

import BaseStore from '../stores/base';

const UserStore = assign({}, BaseStore, {

  getUsers() {
    if (!this.get('users')) this.set('users', []);
    return this.get('users');
  },

  setUsers(users) {
    this.set('users', users);
  },

  parse(json) {
    return {
      id: json.id,
      userName: json.userName,
      email: json.email
    }
  }
});

UserStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action;
  Dispatcher.waitFor([
  ]);

  switch(action.type) {
    case ActionTypes.LOAD_TEAM:
      debugger
      UserStore.setUsers(action.json.users.map((user)=>{return UserStore.parse(user)}));
      UserStore.emitChange();
      break;

    default:
  }

  return true;
});

export default UserStore;

