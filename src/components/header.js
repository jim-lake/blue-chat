'use strict';

import React from 'react-native';

const {
  StyleSheet,
  View,
  Text,
  ActivityIndicatorIOS,
} = React;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 22,
    paddingLeft: 10,
    paddingRight: 10,
    height: 60,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0066ff',
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: 18,
  },
  user: {
    color: 'white',
    fontSize: 15,
  },
});

export default class Header extends React.Component {
  static propTypes = {
    user: React.PropTypes.string,
  };
  render() {
    const { user } = this.props;

    let user_text = null;
    if (user) {
      user_text = <Text style={styles.user}>{user}</Text>;
    }

    const content = (
      <View style={styles.wrapper}>
        <Text style={styles.title}>#bluechat</Text>
        {user_text}
      </View>
    );
    return content;
  }
}
