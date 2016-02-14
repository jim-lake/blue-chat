'use strict';

import React from 'react-native';
import _ from 'lodash';

const {
  StyleSheet,
  View,
  Text,
  ActivityIndicatorIOS,
} = React;

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 5,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'column',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  userDateWrapper: {
    paddingBottom: 5,
    flexDirection: 'row',
  },
  user: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  date: {
    marginLeft: 10,
    color: '#aaa',
    fontSize: 14,
  },
  textWrapper: {
    marginBottom: 5,
    alignSelf: 'stretch',
  },
  text: {
    color: '#333',
    fontSize: 14,
  }
});

export default class ChatLine extends React.Component {
  static propTypes = {
    user: React.PropTypes.string.isRequired,
    textList: React.PropTypes.array.isRequired,
    date: React.PropTypes.string.isRequired,
  };
  render() {
    const { user, textList, date } = this.props;

    const lines = _.map(textList,(text,index) => {
      return (
        <View key={index} style={styles.textWrapper}>
          <Text style={styles.text}>{text}</Text>
        </View>
      );
    });

    const content = (
      <View style={styles.wrapper}>
        <View style={styles.userDateWrapper}>
          <Text style={styles.user}>{user}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {lines}
      </View>
    );
    return content;
  }
}
