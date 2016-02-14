'use strict';

import React from 'react-native';

const {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
} = React;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 22,
    paddingLeft: 10,
    paddingRight: 0,
    height: 60,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0066ff',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  user: {
    flex: 1,
    marginLeft: 5,
    color: 'white',
    fontSize: 14,
  },
  highlight: {
    height: 38,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 26,
    width: 26,
  },
  doneText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default class Header extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    user: React.PropTypes.string,
    onMenuPress: React.PropTypes.func,
    onDonePress: React.PropTypes.func,
    count: React.PropTypes.number,
  };
  static defaultProps = {
    title: "#bluechat",
    user: null,
    showMenu: false,
    onMenuPress: null,
    onDonePress: null,
  };
  render() {
    const { title, user, onMenuPress, onDonePress, count } = this.props;

    let user_text = null;
    if (user) {
      user_text = <Text style={styles.user}>- {user}</Text>;
    }
    let right = null;
    if (onMenuPress) {
      right = (
        <TouchableHighlight
          style={styles.highlight}
          onPress={onMenuPress}
          underlayColor="rgba(255,255,255,0.4)"
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../img/menu.png')}
          />
        </TouchableHighlight>
      );
    } else if(onDonePress) {
      right = (
        <TouchableHighlight
          style={styles.highlight}
          onPress={onDonePress}
          underlayColor="rgba(255,255,255,0.4)"
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableHighlight>
      );
    }
    let title_text = title;
    if (count != undefined) {
      title_text += " (" + count + ")";
    }

    const content = (
      <View style={styles.wrapper}>
        <Text style={styles.title}>{title_text}</Text>
        {user_text}
        {right}
      </View>
    );
    return content;
  }
}
