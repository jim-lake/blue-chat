
import React from 'react-native';
import _ from 'lodash';

import UserStore from './stores/user_store.js';
import Bluetooth from './bluetooth.js';

import LoadingView from './components/loading_view.js';
import Signup from './signup.js';
import Chat from './chat.js'

const { Navigator } = React;

export default class BlueChat extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      is_user_ready: false,
      is_bluetooth_ready: false,
      user: null,
    };
    this._onBluetoothChange = this._onBluetoothChange.bind(this);
    this._onUserChange = this._onUserChange.bind(this);
  }
  componentDidMount() {
    UserStore.addChangeListener(this._onUserChange);
    Bluetooth.addChangeListener(this._onBluetoothChange);

    this._onBluetoothChange();
    this._onUserChange();
  }
  componentWillUnmount() {
    UserStore.removeChangeListener(this._onUserChange);
    Bluetooth.removeChangeListener(this._onBluetoothChange);
  }
  _onBluetoothChange() {
    const is_bluetooth_ready = Bluetooth.isReady();
    this.setState({ is_bluetooth_ready });
  }
  _onUserChange(tag) {
    const is_user_ready = UserStore.isReady();
    const user = UserStore.getUser();
    this.setState({ is_user_ready, user });
  }

  _renderScene(route, navigator) {
    const cls = route.cls;
    const props = _.extend({},{
      navigator,
      user: this.state.user,
      onDone: this._navDone.bind(this),
    },route.props);
    const component = React.createElement(cls,props);
    return component;
  }
  _navDone() {
    this.refs.navigator.pop();
  }
  _configureScene(route) {
    return route.sceneConfig || Navigator.SceneConfigs.VerticalUpSwipeJump;;
  }

  render() {
    const {
      is_user_ready,
      is_bluetooth_ready,
      user,
    } = this.state;

    let content = null;
    if (!is_user_ready || !is_bluetooth_ready) {
      content = <LoadingView />;
    } else if (!user) {
      content = <Signup />;
    } else {
      content = (
        <Navigator
          ref="navigator"
          initialRoute={{ cls: Chat, props: {} }}
          renderScene={this._renderScene.bind(this)}
          configureScene={this._configureScene.bind(this)}
        />
      );
    }
    return content;
  };
}
