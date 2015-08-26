import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

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
      hasAppInitialized: true
    });
  }

  componentDidMount() {
    // RouteStore.on('change', this.onChangeHandler);
  }

  componentWillUnmount() {
    // RouteStore.off('change', this.onChangeHandler);
  }

  onChange(e) {
    this.setState(this.stateFromStore);
  }

  render() {
    return (
      this.state.hasAppInitialized ?
        <div className='app'>
          <Header />
          <DashBoard />
        </div> :
        <Loading />
    );
  }
}

export default App;
