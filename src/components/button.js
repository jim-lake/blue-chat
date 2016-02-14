'use strict';

import React from 'react-native';

const {
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Text,
} = React;

const styles = StyleSheet.create({
  highlight: {
    borderRadius: 4,
    backgroundColor: 'black',
  },
  wrapper: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 20,
    paddingRight: 20,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  defaultWrapper: {
    backgroundColor: '#0066ff',
  },
  defaultText: {
    color: 'white',
  },
  disabledWrapper: {
    backgroundColor: '#777',
  },
  disabledText: {
    color: 'black',
  },
  dangerWrapper: {
    backgroundColor: 'red',
  },
  dangerText: {
    color: 'white',
  },
});

export default class Button extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    type: React.PropTypes.string,
    highlightStyle: View.propTypes.style,
    textStyle: Text.propTypes.style,
  };

  static defaultProps = {
    onPress: function() {},
    type: null,
    highlightStyle: styles.highlight,
  };

  render() {
    const { type } = this.props;
    let wrapper = styles.defaultWrapper;
    let text = styles.defaultText;
    if (type == "disabled") {
      wrapper = styles.disabledWrapper;
      text = styles.disabledText;
    } else if (type == "danger") {
      wrapper = styles.dangerWrapper;
      text = styles.dangerText;
    }

    const content = (
      <TouchableHighlight
        style={[styles.highlight,this.props.highlightStyle]}
        underlayColor="rgba(255,255,255,0.4)"
        onPress={this.props.onPress}
      >
        <View style={[styles.wrapper,wrapper,this.props.style]}>
          <Text style={[styles.text,text,this.props.textStyle]}>
            {this.props.children}
          </Text>
        </View>
      </TouchableHighlight>
    );
    return content;
  }
}
