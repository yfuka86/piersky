import React from 'react';
import _ from 'lodash';

class Slack extends React.Component {

  constructor(props){
    super(props);
    this.state = this.initialState
  }

  get initialState() {
    return {

    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className='slack-settings'>
      </div>
    );
  }
}

export default Slack;
