import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

import SessionAction from '../actions/session';
import IdentityAction from '../actions/identity';
import IntegrationAction from '../actions/integration';
import ViewStore from '../stores/view';
import Loading from '../components/common/loading';
import Balloon from '../components/common/balloon';
import Header from '../components/header';
import Notifier from '../components/common/notifier';
import DashBoard from '../components/dash_board';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return {
      hasAppInitialized: false
    };
  }

  get statesFromStores() {
    return {
      messages: ViewStore.getMessages(),
      uid: ViewStore.getMessagesUid()
    };
  }

  componentDidMount() {
    Promise
    .all([SessionAction.loadUser(), SessionAction.loadTeam(), IdentityAction.load(), IntegrationAction.load()])
    .then(()=> {
      this.setState({hasAppInitialized: true});
    });
    ViewStore.onChange(this.onChangeHandler);
  }

  componentWillUnmount() {
    ViewStore.offChange(this.onChangeHandler);
  }

  onChange(e) {
    this.setState(this.statesFromStores);
  }

  render() {
    return (
      this.state.hasAppInitialized ?
        <div className='app'>
          <Notifier key={this.state.uid} messages={this.state.messages} />
          <Balloon />
          <Header />
          <DashBoard />
        </div> :
        <Loading />
    );
  }
}

export default App;
