'use strict';

function errorLog(...args) {
  console.log(...args);
}

export function get(key,done) {
  if (window && window.localStorage) {
    let value = window.localStorage[key];
    handleResult(null,value);
  } else {
    const { AsyncStorage } = require('react-native');
    AsyncStorage.getItem(key,handleResult);
  }

  function handleResult(err,value) {
    if(value) {
      try {
        value = JSON.parse(value);
      } catch(e) {
        errorLog("Failed to JSON parse key:",key,"value:",value);
      }
    }
    done(err,value);
  }
}

export function set(key,value,done) {
  if (!done) {
    done = function() {};
  }

  try {
    value = JSON.stringify(value);
  } catch(e) {
    errorLog("Failed to stringify key:",key,"value:",value);
    throw e;
  }
  if (window && window.localStorage) {
    window.localStorage[key] = value;
    done();
  } else {
    const { AsyncStorage } = require('react-native');
    AsyncStorage.setItem(key,value,done);
  }
}

export default { get, set };
