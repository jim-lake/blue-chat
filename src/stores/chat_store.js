'use strict';

import EventEmitter from 'events';
import _ from 'lodash';
import moment from 'moment';

import storage from '../storage.js';

import UserStore from './user_store.js';
import BluetoothStore from './bluetooth_store.js';

const CHANGE_EVENT = "change";
const SAVE_PROPS = ['receiveTime','time','unixTime','user','text'];

class ChatStore {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.message_list = [];
    this.user = false;
    this.is_dirty = false;
    this.is_saving = true;

    UserStore.addChangeListener(this._onUserChange.bind(this));
    BluetoothStore.addListener('message',this._onBluetoothMessage.bind(this));
    this.user = UserStore.getUser();

    storage.get('save_list',(err,save_list) => {
      this.is_saving = false;
      if (!err && save_list) {
        save_list.forEach((m) => {
          m.dateMoment = moment(m.time);
        });
        Array.prototype.push.apply(this.message_list,save_list);
        this._sortMessages();
        this.eventEmitter.emit(CHANGE_EVENT);
      }
    });
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
  _saveMessages() {
    this.is_dirty = true;
    if (!this.is_saving) {
      this.is_saving = true;
      this.is_dirty = false;

      const save_list = this.message_list.slice(-10000).map((m) => {
        return _.pick(m,SAVE_PROPS);
      });
      storage.set('save_list',save_list,(err) => {
        this.is_saving = false;
        if (this.is_dirty) {
          setImmediate(this._saveMessages.bind(this));
        }
      });
    }
  }
  _sortMessages() {
    this.message_list.sort((a,b) => {
      let diff = a.time - b.time;
      if (diff == 0) {
        diff = a.receiveTime - b.receiveTime;
      }
      return diff;
    });
  }

  _addMessage(message) {
    if (!message.dateMoment) {
      message.dateMoment = moment(message.time);
    }
    this.message_list.push(message);
    this._sortMessages();
    this._saveMessages();
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
