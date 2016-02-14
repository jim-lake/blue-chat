'use strict';

import React from 'react-native';
import _ from 'lodash';

const {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  PixelRatio,
} = React;

const BG_COLOR = "#ddd";
const BORDER_COLOR = "#999";

const pixelRatio = PixelRatio.get();

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 5,
    paddingRight: 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BORDER_COLOR,
    borderTopWidth: 1/pixelRatio,
    borderStyle: 'solid',
    backgroundColor: BG_COLOR,
  },
  inputWrapper: {
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1/pixelRatio,
    borderColor: BORDER_COLOR,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 30,
    color: '#444',
    fontSize: 16,
  },
  highlight: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  sendWrapper: {
    height: 40,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#0066ff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default class ChatInput extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      text: "",
    };
  }

  static propTypes = {
    onSendPress: React.PropTypes.func.isRequired,
  };
  _onSendPress() {

  }
  _onSendPress(e) {
    let { text } = this.state;
    if (e && e.nativeEvent && e.nativeEvent.text) {
      text = e.nativeEvent.text;
    }
    this.props.onSendPress(text);
    this.setState({ text: "" });
  }

  render() {
    const { text } = this.state;

    let send = null;
    if (text.length > 0) {
      send = (
        <TouchableHighlight
          style={styles.highlight}
          underlayColor="rgba(255,255,255,0.4)"
          onPress={this._onSendPress.bind(this)}
        >
          <View style={styles.sendWrapper}>
            <Text style={styles.sendText}>Send</Text>
          </View>
        </TouchableHighlight>
      );
    }

    const content = (
      <View style={styles.wrapper}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref="input"
            style={styles.input}
            placeholder="Message"
            placeholderColor="#bbb"
            onChangeText={text => this.setState({ text })}
            blurOnSubmit={false}
            value={text}
            returnKeyType="send"
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={this._onSendPress.bind(this)}
          />
        </View>
        {send}
      </View>
    );
    return content;
  }
}
