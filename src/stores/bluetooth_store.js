'use strict';

import EventEmitter from 'events';
import _ from 'lodash';
import { Buffer } from 'buffer';

import Bluetooth from '../bluetooth.js';

const RESEND_TIMEOUT_MS = 30*1000;

class BluetoothStore {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.message_map = {};
    Bluetooth.addListener('updateValue',this._onBluetoothValueUpdate.bind(this));
  }
  addListener(event,callback) {
    this.eventEmitter.on(event,callback);
  }
  removeListener(event,callback) {
    this.eventEmitter.removeListener(event,callback);
  }
  _onBluetoothValueUpdate(data) {
    const { valueBase64 } = data.characteristic;
    if (valueBase64 in this.message_map) {
      //console.log("dup message:",data.characteristic.value);
    } else {
      const { valueBuffer } = data.characteristic;
      const unixTime = valueBuffer.readUInt32LE(0);
      const user_len = valueBuffer.readUInt8(4);
      const user = valueBuffer.toString('utf8',5,5+user_len);
      const text = valueBuffer.toString('utf8',5+user_len);

      const time = unixTime * 1000;
      const message = {
        receiveTime: data.time,
        time,
        unixTime,
        user,
        text,
      };
      this.message_map[valueBase64] = true;
      this.eventEmitter.emit('message',message);

      const age_ms = Date.now() - time;
      if (age_ms < RESEND_TIMEOUT_MS) {
        Bluetooth.sendValue(valueBuffer);
      } else {
        //console.log("old message, not resending age_ms:",age_ms);
      }
    }
  }
  sendMessage(message,done = function() {}) {
    const user_buf = new Buffer(message.user);
    const text_buf = new Buffer(message.text);

    const buffer_length = user_buf.length + text_buf.length + 5;
    const buffer = new Buffer(buffer_length);
    buffer.writeUInt32LE(message.unixTime,0);
    buffer.writeUInt8(user_buf.length,4);
    user_buf.copy(buffer,5);
    text_buf.copy(buffer,5 + user_buf.length);

    const valueBase64 = buffer.toString('base64');
    this.message_map[valueBase64] = true;
    Bluetooth.sendValue(buffer,done);
  }
}

const g_store = new BluetoothStore();
export default g_store;
