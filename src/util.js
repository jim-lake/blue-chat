'use strict';

import _ from 'lodash';

export function errorLog(...args) {
  console.error(...args);
}

export function deepEqual(x,y) {
  if (x !== y) {
    if (typeof x == 'object' && typeof y == 'object') {
      for (let p in x) {
        if (x.hasOwnProperty(p)) {
          if (!y.hasOwnProperty(p)) {
            return false;
          } else if (!deepEqual(x[p],y[p])) {
            return false;
          }
        }
      }

      for (let p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  return true;
}

export default { errorLog, deepEqual };
