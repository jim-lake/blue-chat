'use strict';

import React from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import _ from 'lodash';

import ChatStore from './stores/chat_store.js';
import UserStore from './stores/user_store.js';

import Overlay from './components/overlay.js';
import Header from './components/header.js';
import Button from './components/button.js';
import LoadingView from './components/loading_view.js';
import ChatLine from './components/chat_line.js';

import Signup from './signup.js';
import Bluetooth from './bluetooth.js';

const MSG_COMBINE_MS = 10*60*1000;

const {
  Text,
  View,
  TextInput,
  ScrollView,
  DeviceEventEmitter,
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
  inputContainer: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
  },
  input: {
    height: 30,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch',
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

export default class BlueChat extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      is_user_ready: false,
      is_bluetooth_ready: false,
      is_bluetooth_on: false,
      user: false,
      message_list: [],
      text: "",
      keyboard_height: 0,
    };
    this._onBluetoothChange = this._onBluetoothChange.bind(this);
    this._onUserChange = this._onUserChange.bind(this);
    this._onChatChange = this._onChatChange.bind(this);
    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
  }
  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardWillShow',this._keyboardWillShow);
    DeviceEventEmitter.addListener('keyboardWillHide',this._keyboardWillHide);
    UserStore.addChangeListener(this._onUserChange);
    ChatStore.addChangeListener(this._onChatChange);
    Bluetooth.addChangeListener(this._onBluetoothChange);

    this._onBluetoothChange();
    this._onUserChange();
    this._onChatChange();
  }
  componentWillUnmount() {
    DeviceEventEmitter.removeListener('keyboardWillShow',this._keyboardWillShow);
    DeviceEventEmitter.removeListener('keyboardWillHide',this._keyboardWillHide);
    UserStore.removeChangeListener(this._onUserChange);
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
    const is_bluetooth_ready = Bluetooth.isReady();
    const is_bluetooth_on = Bluetooth.isPoweredOn();
    this.setState({ is_bluetooth_ready, is_bluetooth_on });
  }
  _onUserChange(tag) {
    const is_user_ready = UserStore.isReady();
    const user = UserStore.getUser();
    this.setState({ is_user_ready, user });
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

  _sendPress(e) {
    let { text } = this.state;
    if (e && e.nativeEvent && e.nativeEvent.text) {
      text = e.nativeEvent.text;
    }
    ChatStore.sendMessage(text,(err) => {
      this.setState({ text: "" });
      this.refs.scrollView.scrollTo(0);
    });
  }
  _logoutPress() {
    UserStore.setUser(false);
  }

  render() {
    const {
      is_user_ready,
      is_bluetooth_ready,
      is_bluetooth_on,
      user,
      message_list,
      text,
      keyboard_height,
    } = this.state;

    let content;
    if (!is_user_ready || !is_bluetooth_ready) {
      content = <LoadingView />;
    } else if (!user) {
      content = <Signup />;
    } else {
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
      content = (
        <View style={[styles.container,{ marginBottom: keyboard_height }]}>
          <Header user={user} />
          <Button onPress={this._logoutPress.bind(this)}>Logout</Button>
          <InvertibleScrollView
            ref="scrollView"
            style={styles.scrollContainer}
            inverted
          >
            {lines}
          </InvertibleScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              ref="input"
              style={styles.input}
              onChangeText={text => this.setState({ text })}
              blurOnSubmit={false}
              value={text}
              returnKeyType="send"
              enablesReturnKeyAutomatically={true}
              onSubmitEditing={this._sendPress.bind(this)}
            />
          </View>
          {overlay}
        </View>
      );
    }
    return content;
  }
}
