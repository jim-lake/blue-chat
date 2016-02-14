'use strict';

import { DeviceEventEmitter } from 'react-native';
import EventEmitter from 'events';

class KeyboardEvents {
  constructor() {
    this.eventEmitter = new EventEmitter();
    DeviceEventEmitter.addListener('keyboardWillShow',this._keyboardWillShow.bind(this));
    DeviceEventEmitter.addListener('keyboardWillHide',this._keyboardWillHide.bind(this));
  }
  _keyboardWillShow(e) {
    this.eventEmitter.emit('keyboardWillShow',e);
  }
  _keyboardWillHide(e) {
    this.eventEmitter.emit('keyboardWillHide',e);
  }
  addListener(event,callback) {
    this.eventEmitter.on(event,callback);
  }
  removeListener(event,callback) {
    this.eventEmitter.removeListener(event,callback);
  }
}

const g_object = new KeyboardEvents();
export default g_object;
