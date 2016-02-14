'use strict';

import React from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import _ from 'lodash';
import moment from 'moment';

import ChatStore from './stores/chat_store.js';
import UserStore from './stores/user_store.js';

import Overlay from './components/overlay.js';
import Header from './components/header.js';
import Button from './components/button.js';
import ChatLine from './components/chat_line.js';
import ChatInput from './components/chat_input.js';

import Bluetooth from './bluetooth.js';
import KeyboardEvents from './keyboard_events.js';

import Settings from './settings.js';

const MSG_COMBINE_MS = 10*60*1000;

const {
  Text,
  View,
  TextInput,
  ScrollView,
} = React;

const styles = React.StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    margin: 10,
    fontSize: 20,
    textAlign: 'left',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  button: {
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
  },
});

export default class Chat extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      is_bluetooth_on: false,
      message_list: [],
      keyboard_height: 0,
    };
    this._onBluetoothChange = this._onBluetoothChange.bind(this);
    this._onChatChange = this._onChatChange.bind(this);
    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
  }
  static propTypes = {
    user: React.PropTypes.string.isRequired,
  };
  componentDidMount() {
    KeyboardEvents.addListener('keyboardWillShow',this._keyboardWillShow);
    KeyboardEvents.addListener('keyboardWillHide',this._keyboardWillHide);
    ChatStore.addChangeListener(this._onChatChange);
    Bluetooth.addChangeListener(this._onBluetoothChange);

    this._onBluetoothChange();
    this._onChatChange();
  }
  componentWillUnmount() {
    KeyboardEvents.removeListener('keyboardWillShow',this._keyboardWillShow);
    KeyboardEvents.removeListener('keyboardWillHide',this._keyboardWillHide);
    ChatStore.removeChangeListener(this._onChatChange);
    Bluetooth.removeChangeListener(this._onBluetoothChange);
  }
  _keyboardWillShow(e) {
    if (e.endCoordinates && e.endCoordinates.height) {
      const keyboard_height = e.endCoordinates.height;
      this.setState({ keyboard_height });
    }
  }
  _keyboardWillHide(e) {
    this.setState({ keyboard_height: 0 });
  }
  _onBluetoothChange() {
    const is_bluetooth_on = Bluetooth.isPoweredOn() || true;
    this.setState({ is_bluetooth_on });
  }

  _onChatChange() {
    const raw_list = ChatStore.getMessageList();
    const message_list = [];
    let last_message = false;
    _.each(raw_list,(message) => {
      const { text } = message;
      if (last_message
        && (last_message.user == message.user)
        && ((message.time - last_message.time) < MSG_COMBINE_MS)) {
        last_message.text_list.push(text);
      } else {
        const date = message.dateMoment.format("hh:mma");
        last_message = {
          time: message.time,
          date,
          user: message.user,
          text_list: [text],
        };
        message_list.unshift(last_message);
      }
    });

    this.setState({ message_list });
  }

  _onSendPress(text) {
    this.refs.scrollView.scrollTo(0);
    ChatStore.sendMessage(text);
  }
  _onMenuPress() {
    this.props.navigator.push({ cls: Settings });
  }

  render() {
    const { user } = this.props;
    const {
      is_bluetooth_on,
      message_list,
      text,
      keyboard_height,
    } = this.state;

    const lines = _.map(message_list,(message,index) => {
      const { user, text_list, date } = message;
      return (
        <ChatLine
          key={index}
          user={user}
          textList={text_list}
          date={date}
        />
      );
    });

    let overlay = null;
    if (!is_bluetooth_on) {
      overlay = (
        <Overlay>
          <Text style={styles.overlayText}>Please Turn On Bluetooth</Text>
        </Overlay>
      );
    }
    const content = (
      <View style={[styles.container,{ marginBottom: keyboard_height }]}>
        <Header
          user={user}
          showMenu={true}
          onMenuPress={this._onMenuPress.bind(this)}
        />
        <InvertibleScrollView
          ref="scrollView"
          style={styles.scrollContainer}
          inverted
        >
          {lines}
        </InvertibleScrollView>
        <ChatInput onSendPress={this._onSendPress.bind(this)} />
        {overlay}
      </View>
    );
    return content;
  }
}
