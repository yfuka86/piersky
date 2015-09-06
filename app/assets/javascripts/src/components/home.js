import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.onChangeHandler = this.onChange.bind(this);
  }

  get initialState() {
    return _.extend({
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChange(e) {
    this.setState(this.initialState);
  }

  render() {
    return (
      <div className='home container'>
        <RouteHandler />
        <div className='clear-fix' />
      </div>
    );
  }
}

export default Home;
