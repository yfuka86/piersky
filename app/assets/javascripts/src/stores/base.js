import {EventEmitter2 as EventEmitter} from 'eventemitter2';
import assign from 'object-assign';
import _ from 'lodash';
import Dispatcher from '../dispatcher';
import Constants from '../constants/app';

const CHANGE_EVENT = 'change';
const MAX_LISTENER_DEFAULT = 20;

const BaseStore = assign(EventEmitter.prototype, {

  _storage: null,

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  onChange(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  offChange(callback) {
    this.off(CHANGE_EVENT, callback);
  },

  getStorage() {
    if (this._storage) {
      return this._storage;
    } else {
      let newObj = {};
      this._storage = newObj;
      return newObj;
    }
  },

  setStorage(obj) {
    this._storage = obj;
  },

  get(key) {
    return this.getStorage()[key];
  },

  set(key, value) {
    this.getStorage()[key] = value;
  },

  reset(obj={}) {
    this.setStorage(obj);
  }
});

export default BaseStore;
