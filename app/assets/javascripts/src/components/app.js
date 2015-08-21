import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';
import Notifier from '../components/common/notifier';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  get stateFromStore() {
    return _.extend({
    });
  }

  getInitialState() {
    this.stateFromStore;
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
      <div className='app' id='container'>
        <RouteHandler/>
      </div>
    );
  }
}

export default App;
