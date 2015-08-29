import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

import SessionAction from '../actions/'
import Balloon from '../components/common/balloon';
import Header from '../components/header';
import Notifier from '../components/common/notifier';
import DashBoard from '../components/dash_board';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return _.extend({
      hasAppInitialized: false
    });
  }

  componentDidMount() {
    [SessionAction.loadUser(), SessionAction.loadTeam()].then(=> {
      this.setState({hasAppInitialized: true});
    });
  }

  componentWillUnmount() {
  }

  onChange(e) {
    this.setState(this.stateFromStore);
  }

  render() {
    return (
      this.state.hasAppInitialized ?
        <div className='app'>
          <Balloon />
          <Header />
          <DashBoard />
        </div> :
        <Loading />
    );
  }
}

export default App;
