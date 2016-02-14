'use strict';

import EventEmitter from 'events';

import storage from '../storage.js';
import util from '../util.js';

const CHANGE_EVENT = "change";

class UserStore {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.user = false;
    this.is_ready = false;

    storage.get('user',(err,value) => {
      this.is_ready = true;
      this._updateUser(value || false,'startup');
    });
  }
  addChangeListener(callback) {
    this.eventEmitter.on(CHANGE_EVENT,callback);
  }
  removeChangeListener(callback) {
    this.eventEmitter.removeListener(CHANGE_EVENT,callback);
  }
  _updateUser(user,tag) {
    if (!util.deepEqual(this.user,user)) {
      this.user = user;
      this.eventEmitter.emit(CHANGE_EVENT,tag);
    } else if (tag == 'startup') {
      this.eventEmitter.emit(CHANGE_EVENT,tag);
    }
  }
  setUser(user) {
    this._updateUser(user);
    storage.set('user',user);
  }
  getUser() {
    return this.user;
  }
  isReady() {
    return this.is_ready;
  }
}

const g_store = new UserStore();
export default g_store;
