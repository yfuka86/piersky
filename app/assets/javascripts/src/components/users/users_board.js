import React from 'react';
import {Link, RouteHandler} from 'react-router';
import _ from 'lodash';

class UsersBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
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
    this.setState(this.InitialState);
  }

  render() {
    return (
      <div/>
    );
  }
}

export default UsersBoard;
