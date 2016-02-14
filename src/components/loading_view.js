'use strict';

import React from 'react-native';

const {
  StyleSheet,
  View,
  ActivityIndicatorIOS,
} = React;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0066ff',
  },
});

export default class LoadingView extends React.Component {
  render() {
    const content = (
      <View style={styles.wrapper}>
        <ActivityIndicatorIOS size="large" color="white" />
      </View>
    );
    return content;
  }
}
