'use strict';

import React from 'react-native';
import _ from 'lodash';

import UserStore from './stores/user_store.js';

import Header from './components/header.js';
import Button from './components/button.js';

const {
  Text,
  View,
  TextInput,
} = React;

const styles = React.StyleSheet.create({
  wrapper: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  instructions: {
    marginTop: 12,
    color: '#0066ff',
    fontSize: 18,
    textAlign: 'center',
  },
  inputWrapper: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch',
    color: '#333',
    fontSize: 16,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  button: {
    marginTop: 10,
  },
});

export default class Settings extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      text: props.user,
    };
  }
  componentDidRecieveProps(props) {
    this.setState({ text: props.user })
  }

  _onDonePress() {
    this._onSubmitPress();
    this.props.navigator.pop();
  }

  _onSubmitPress() {
    const { text } = this.state;
    if (!text) {
      alert("Please enter a user name.");
    } else {
      UserStore.setUser(text);
    }
  }

  render() {
    const { text } = this.state;

    const content = (
      <View style={styles.wrapper}>
        <Header title="Settings" onDonePress={this._onDonePress.bind(this)} />
        <Text style={styles.instructions}>Name</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="User Name"
            placeholderColor="#666"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={16}
            onChangeText={text => this.setState({ text })}
            value={text}
            onSubmitEditing={this._onSubmitPress.bind(this)}
          />
        </View>
      </View>
    );
    return content;
  }
}
