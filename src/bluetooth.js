'use strict';

import React from 'react-native';
import EventEmitter from 'events';
import _ from 'lodash';
import { Buffer } from 'buffer';

const { NativeAppEventEmitter, NativeModules } = React;
const { BluetoothModule } = NativeModules;

const PERIPHERAL_POLL_MS = 5000;
const CHANGE_EVENT = "change";

class Bluetooth {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.is_powered_on = false;
    this.is_ready = false;

    NativeAppEventEmitter.addListener('bluetooth.peripheral.read',
      this._onPeripheralRead.bind(this));
    NativeAppEventEmitter.addListener('bluetooth.peripheral.update_value',
      this._onPeripheralUpdateValue.bind(this));
    NativeAppEventEmitter.addListener('bluetooth.central.state',
      this._onCentralState.bind(this));

    BluetoothModule.init((err) => {
      BluetoothModule.getState((err,state) => {
        this._onCentralState(state,'startup');
      });

      setInterval(this._checkPeripherials,PERIPHERAL_POLL_MS);
    });
  }
  addListener(event,callback) {
    this.eventEmitter.on(event,callback);
  }
  removeListener(event,callback) {
    this.eventEmitter.removeListener(event,callback);
  }
  addChangeListener(callback) {
    this.eventEmitter.on(CHANGE_EVENT,callback);
  }
  removeChangeListener(callback) {
    this.eventEmitter.removeListener(CHANGE_EVENT,callback);
  }

  _onCentralState(state,tag) {
    this.is_ready = true;
    const is_powered_on = !!state.isPoweredOn;
    if (this.is_powered_on != is_powered_on) {
      this.is_powered_on = is_powered_on;
      this.eventEmitter.emit(CHANGE_EVENT,tag);
    } else if (tag == 'startup') {
      this.eventEmitter.emit(CHANGE_EVENT,tag);
    }
  }
  _onPeripheralRead(data) {
    const opts = {
      requestId: data.requestId,
      value: "1234",
    };
    BluetoothModule.respondToRequest(opts,(err) => {
      console.log("Bluetooth._onPeripheralRead: respondToRequest err:",err);
    });
  }
  _onPeripheralUpdateValue(data) {
    const { characteristic } = data;
    const { valueBase64 } = characteristic;
    const buf = new Buffer(valueBase64,'base64');
    characteristic.valueBuffer = buf;
    characteristic.value = buf.toString('utf8');

    this.eventEmitter.emit("updateValue",data);
  }
  _checkPeripherials() {
    BluetoothModule.getPeripheralList((err,peripheral_list) => {
      peripheral_list.forEach((p) => {
        if (!p.isConnected && !p.isConnecting) {
          BluetoothModule.connectToPeripheral(p.peripheral,(err) => {});
        }
      });
    });
  }
  isReady() {
    return this.is_ready;
  }
  isPoweredOn() {
    return this.is_powered_on;
  }
  startScanning() {
    BluetoothModule.startScanning((err) => {
      console.log("Bluetooth.startScanning: err:",err);
    });
  }
  sendValue(value,done = function() {}) {
    if (Buffer.isBuffer(value)) {
      value = value.toString('base64');
    } else {
      value = new Buffer(value,'utf8').toString('base64');
    }
    BluetoothModule.notifyWithValue(value,done);
  }
}

const g_object = new Bluetooth();
export default g_object;
