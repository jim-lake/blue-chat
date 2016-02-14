'use strict';

import EventEmitter from 'event-emitter';
import _ from 'lodash';
import moment from 'moment';

import UserStore from './user_store.js';
import BluetoothStore from './bluetooth_store.js';

const CHANGE_EVENT = "change";

class ChatStore {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.message_list = [];
    this.user = false;

    UserStore.addChangeListener(this._onUserChange.bind(this));
    BluetoothStore.addListener('message',this._onBluetoothMessage.bind(this));
  }
  addChangeListener(callback) {
    this.eventEmitter.on(CHANGE_EVENT,callback);
  }
  removeChangeListener(callback) {
    this.eventEmitter.removeListener(CHANGE_EVENT,callback);
  }
  _onUserChange() {
    this.user = UserStore.getUser();
  }
  _onBluetoothMessage(message) {
    this._addMessage(message);
  }
  _addMessage(message) {
    this.message_list.push(message);
    this.message_list.sort((a,b) => {
      let diff = a.time - b.time;
      if (diff == 0) {
        diff = a.receiveTime - b.receiveTime;
      }
      return diff;
    });
    this.eventEmitter.emit(CHANGE_EVENT);
  }
  sendMessage(text,done = function() {}) {
    const m = moment();
    const message = {
      receiveTime: 0,
      time: m.valueOf(),
      unixTime: m.unix(),
      dateMoment: m,
      user: this.user,
      text: text,
    };
    this._addMessage(message);
    BluetoothStore.sendMessage(message,done);
  }
  getMessageList() {
    return this.message_list;
  }
}

const g_store = new ChatStore();
export default g_store;
