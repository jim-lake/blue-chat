'use strict';

import React from 'react-native';

const { AppModule } = React.NativeModules;

function _notImplemented(done) {
  done('not_implemented');
}

let g_versions = false;
let g_versions_callback_list = []];

if (AppModule) {
  AppModule.getVersions((err,versions) => {
    g_versions = versions;
    g_versions_callback_list.forEach((cb) => {
      cb(null,g_versions);
    });
  });
}

function _getVersions(done) {
  if (g_versions) {
    done(null,g_versions);
  } else {
    g_versions_callback_list.push(done);
  }
}

const getVersions = AppModule ? _getVersions : _notImplemented;

export default { getVersions };
