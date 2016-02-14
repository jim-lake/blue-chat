'use strict';

import React from 'react-native';

const {
  StyleSheet,
  View,
} = React;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  innerWrapper: {
    margin: 40,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0066ff',
    borderRadius: 8,
  },
});

export default class Overlay extends React.Component {
  render() {
    const content = (
      <View style={styles.wrapper}>
        <View style={styles.innerWrapper}>
          {this.props.children}
        </View>
      </View>
    );
    return content;
  }
}
